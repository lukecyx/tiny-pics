data "aws_caller_identity" "current" {}

# Assume role policy template for all lambdas
data "aws_iam_policy_document" "assume_lambda_role" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

# IAM Role per Lambda
resource "aws_iam_role" "lambda_execution_role" {
  for_each           = var.lambdas
  name               = "${each.key}_lambda_execution_role"
  assume_role_policy = data.aws_iam_policy_document.assume_lambda_role.json
}

# --- Optional S3 policy ---
data "aws_iam_policy_document" "s3_access" {
  for_each = { for k, v in var.lambdas : k => v if v.enable_s3 }

  statement {
    effect  = "Allow"
    actions = ["s3:GetObject", "s3:ListBucket"]
    resources = [
      "arn:aws:s3:::${each.value.uploaded_bucket}",
      "arn:aws:s3:::${each.value.uploaded_bucket}/*",
    ]
  }

  statement {
    effect  = "Allow"
    actions = ["s3:PutObject", "s3:ListBucket"]
    resources = [
      "arn:aws:s3:::${each.value.resized_bucket}",
      "arn:aws:s3:::${each.value.resized_bucket}/*",
    ]
  }
}

resource "aws_iam_policy" "lambda_s3_policy" {
  for_each = data.aws_iam_policy_document.s3_access
  name     = "${each.key}_lambda_s3_policy"
  policy   = each.value.json
}

resource "aws_iam_role_policy_attachment" "attach_s3_policy" {
  for_each   = aws_iam_policy.lambda_s3_policy
  role       = aws_iam_role.lambda_execution_role[each.key].name
  policy_arn = each.value.arn
}

# --- Optional DynamoDB policy ---
data "aws_iam_policy_document" "dynamodb_access" {
  for_each = { for k, v in var.lambdas : k => v if v.enable_dynamodb }

  statement {
    effect = "Allow"
    actions = [
      "dynamodb:UpdateItem",
      "dynamodb:GetItem",
      "dynamodb:DescribeTable"
    ]
    resources = [
      "arn:aws:dynamodb:${var.region}:${data.aws_caller_identity.current.account_id}:table/${each.value.table_name}"
    ]
  }
}

resource "aws_iam_policy" "lambda_dynamodb_policy" {
  for_each = data.aws_iam_policy_document.dynamodb_access
  name     = "${each.key}_lambda_dynamodb_policy"
  policy   = each.value.json
}

resource "aws_iam_role_policy_attachment" "attach_dynamodb_policy" {
  for_each   = aws_iam_policy.lambda_dynamodb_policy
  role       = aws_iam_role.lambda_execution_role[each.key].name
  policy_arn = each.value.arn
}

# --- Optional Logging policy ---
data "aws_iam_policy_document" "lambda_logging" {
  for_each = { for k, v in var.lambdas : k => v if v.enable_logging }

  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["arn:aws:logs:*:*:*"]
  }
}

resource "aws_iam_policy" "lambda_logging_policy" {
  for_each = data.aws_iam_policy_document.lambda_logging
  name     = "${each.key}_lambda_logging_policy"
  policy   = each.value.json
}

resource "aws_iam_role_policy_attachment" "attach_logging_policy" {
  for_each   = aws_iam_policy.lambda_logging_policy
  role       = aws_iam_role.lambda_execution_role[each.key].name
  policy_arn = each.value.arn
}

# --- Lambda function ---
resource "aws_lambda_function" "lambda_function" {
  for_each = var.lambdas

  function_name    = each.value.function_name
  filename         = each.value.filename
  handler          = each.value.handler
  runtime          = each.value.runtime
  memory_size      = each.value.memory_size
  timeout          = each.value.timeout
  role             = aws_iam_role.lambda_execution_role[each.key].arn
  source_code_hash = filebase64sha256(each.value.filename)

  environment {
    variables = each.value.environment
  }

  tags = {
    Environment = "dev"
    Application = "tiny-pics"
  }
}

resource "aws_lambda_function" "resizer" {
  filename         = "${path.module}/lambda.zip"
  function_name    = "resize_image"
  role             = var.iam_role_arn
  handler          = "index.handler"
  source_code_hash = filebase64sha256("${path.module}/lambda.zip")
  memory_size      = 1024
  timeout          = 30


  runtime = "nodejs22.x"

  environment {
    variables = {
      ENVIRONMENT              = "dev"
      LOG_LEVEL                = "info"
      AWS_UPLOADED_BUCKET_NAME = "tiny-pics-uploaded"
      AWS_RESIZED_BUCKET_NAME  = "tiny-pics-resized"
    }
  }

  tags = {
    Environment = "dev"
    Application = "example"
  }
}

resource "aws_lambda_permission" "allow_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.resizer.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = var.s3_uploaded_bucket_arn
}

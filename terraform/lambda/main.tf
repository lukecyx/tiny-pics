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
    Application = "tiny-pics"
  }
}


resource "aws_lambda_function" "websocket" {
  filename         = "${path.module}/websocket_lambda.zip"
  function_name    = "websocket_pusher"
  role             = var.iam_role_arn
  handler          = "index.handler"
  source_code_hash = filebase64sha256("${path.module}/websocket_lambda.zip")
  memory_size      = 1024
  timeout          = 30


  runtime = "nodejs22.x"

  environment {
    variables = {
      ENVIRONMENT = "dev"
      LOG_LEVEL   = "info"
    }
  }

  tags = {
    Environment = "dev"
    Application = "tiny-pics"
  }
}

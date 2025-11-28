module "lambda" {
  source = "./lambda"

  region = var.region

  lambdas = {
    resizer = {
      function_name = "resize_image"
      filename      = "${path.module}/lambda.zip"
      handler       = "index.handler"
      runtime       = "nodejs22.x"
      memory_size   = 1024
      timeout       = 30
      environment = {
        ENVIRONMENT              = "dev"
        LOG_LEVEL                = "info"
        AWS_UPLOADED_BUCKET_NAME = "tiny-pics-uploaded"
        AWS_RESIZED_BUCKET_NAME  = "tiny-pics-resized"
      }
      enable_s3       = true
      uploaded_bucket = "tiny-pics-uploaded"
      resized_bucket  = "tiny-pics-resized"
      enable_dynamodb = true
      table_name      = "Sessions"
      enable_logging  = true
    }

    websocket = {
      function_name = "websocket_pusher"
      filename      = "${path.module}/websocket_lambda.zip"
      handler       = "index.handler"
      runtime       = "nodejs22.x"
      memory_size   = 1024
      timeout       = 30
      environment = {
        ENVIRONMENT = "dev"
        LOG_LEVEL   = "info"
      }
      enable_s3       = false
      uploaded_bucket = ""
      resized_bucket  = ""
      enable_dynamodb = false
      table_name      = ""
      enable_logging  = true
    }
  }
}

# Reference the outputs for permissions and SNS
resource "aws_lambda_permission" "allow_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda.lambda_function_names["resizer"]
  principal     = "s3.amazonaws.com"
  source_arn    = module.s3.s3_uploaded_bucket_arn
}

resource "aws_sns_topic_subscription" "websocket_lambda_sub" {
  topic_arn = module.sns.resized_images_sns_topic_arn
  protocol  = "lambda"
  endpoint  = module.lambda.lambda_function_arns["websocket"]
}

resource "aws_lambda_permission" "allow_sns" {
  action        = "lambda:InvokeFunction"
  function_name = module.lambda.lambda_function_names["websocket"]
  principal     = "sns.amazonaws.com"
  source_arn    = module.sns.resized_images_sns_topic_arn
}

module "s3" {
  source                        = "./s3"
  project                       = var.project
  lambda_resizer_permission_dep = aws_lambda_permission.allow_bucket.id
  lambda_resizer_func_arn       = module.lambda.lambda_function_arns["resizer"]
}

module "dynamoDb" {
  source = "./dynamo"
}

module "sns" {
  source = "./sns"

}

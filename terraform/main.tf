module "lambda" {
  source                 = "./lambda"
  s3_uploaded_bucket_arn = module.s3.s3_uploaded_bucket_arn
  iam_role_arn           = module.iam.lambda_resize_role_arn
  region                 = var.region
}

module "s3" {
  source                        = "./s3"
  project                       = var.project
  lambda_resizer_permission_dep = aws_lambda_permission.allow_bucket.id
  lambda_resizer_func_arn       = module.lambda.lambda_resizer_func_arn
}

module "iam" {
  source               = "./iam"
  uploaded_bucket_name = "tiny-pics-uploaded"
  resized_bucket_name  = "tiny-pics-resized"
  region               = var.region
  table_name           = "Sessions"
}

module "dynamoDb" {
  source = "./dynamo"
}

module "sns" {
  source = "./sns"

}

resource "aws_lambda_permission" "allow_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda.lambda_resizer_func_name
  principal     = "s3.amazonaws.com"
  source_arn    = module.s3.s3_uploaded_bucket_arn
}

resource "aws_sns_topic_subscription" "websocket_lambda_sub" {
  topic_arn = module.sns.resized_images_sns_topic_arn
  protocol  = "lambda"
  endpoint  = module.lambda.lambda_websocket_func_arn
}

resource "aws_lambda_permission" "allow_sns" {
  action        = "lambda:InvokeFunction"
  function_name = module.lambda.lambda_websocket_func_name
  principal     = "sns.amazonaws.com"
  source_arn    = module.sns.resized_images_sns_topic_arn
}

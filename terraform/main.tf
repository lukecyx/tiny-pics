module "lambda" {
  source                 = "./lambda"
  s3_uploaded_bucket_arn = module.s3.s3_uploaded_bucket_arn
  iam_role_arn           = module.iam.lambda_role_arn
  region                 = var.region
}

module "s3" {
  source                = "./s3"
  project               = var.project
  lambda_permission_dep = module.lambda.lambda_permission_id
  lambda_func_arn       = module.lambda.lambda_func_arn
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

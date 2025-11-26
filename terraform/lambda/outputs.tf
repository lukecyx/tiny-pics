output "lambda_permission_id" {
  value = aws_lambda_permission.allow_bucket.id
}

output "lambda_func_arn" {
  value = aws_lambda_function.resizer.arn
}

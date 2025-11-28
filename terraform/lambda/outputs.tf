output "lambda_function_arns" {
  value = { for k, v in aws_lambda_function.lambda_function : k => v.arn }
}

output "lambda_function_names" {
  value = { for k, v in aws_lambda_function.lambda_function : k => v.function_name }
}

output "lambda_execution_role_arns" {
  value = { for k, v in aws_iam_role.lambda_execution_role : k => v.arn }
}

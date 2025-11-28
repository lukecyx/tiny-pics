output "lambda_resizer_func_arn" {
  value = aws_lambda_function.resizer.arn
}

output "lambda_resizer_func_name" {
  value = aws_lambda_function.resizer.function_name
}


output "lambda_websocket_func_name" {
  value = aws_lambda_function.websocket.function_name
}

output "lambda_websocket_func_arn" {
  value = aws_lambda_function.websocket.arn
}

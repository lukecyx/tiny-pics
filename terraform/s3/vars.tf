variable "project" {
  description = "the name of the project"
  type        = string
  default     = "tiny-pics"
}

variable "lambda_func_arn" {
  description = "the arn of the resizer lambda func"
  type        = string
}

variable "lambda_permission_dep" {
  description = "the permission id to allow bucket to invoke function"
  type        = string
}

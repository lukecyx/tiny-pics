variable "region" {
  type = string
}

variable "lambdas" {
  type = map(object({
    function_name : string
    filename : string
    handler : string
    runtime : string
    memory_size : number
    timeout : number
    environment : map(string)

    enable_s3 : bool
    uploaded_bucket : string
    resized_bucket : string

    enable_dynamodb : bool
    table_name : string

    enable_logging : bool
  }))
}

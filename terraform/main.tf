provider "aws" {
  region = var.region
}

resource "aws_dynamodb_table" "products" {
  name         = var.product_table_name
}

resource "aws_lambda_function" "create_product" {
  function_name = "create-product"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "src/handlers/createProduct.createProduct"
  runtime       = "nodejs18.x"
  filename      = "function.zip"
  source_code_hash = filebase64sha256("function.zip")
}

resource "aws_api_gateway_rest_api" "api" {
  name        = "product-api"
  description = "API for product operations"
}

resource "aws_api_gateway_resource" "products" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "products"
}

# resource "aws_api_gateway_method" "create" {
#   rest_api_id   = aws_api_gateway_rest_api.api.id
#   resource_id   = aws_api_gateway_resource.products.id
#   http_method   = "POST"
#   authorization = "NONE"
#   integration {
#     type             = "AWS_PROXY"
#     integration_http_method = "POST"
#     uri              = aws_lambda_function.create_product.invoke_arn
#   }
# }

resource "aws_lambda_permission" "allow_api_gateway" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_product.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.api.execution_arn}/*/*/*"
}

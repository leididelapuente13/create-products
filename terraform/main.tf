provider "aws" {
  region = var.region
}


resource "aws_iam_role_policy" "lambda_policy" {
  name = "lambda_dynamo_policy"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement: [
      {
        Action = [
          "dynamodb:PutItem",
        ],
        Effect   = "Allow",
        Resource = "*"
      },
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Effect   = "Allow",
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role" "lambda_exec" {
  name = "lambda_exec_role_lambda_create_product"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement: [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}


resource "aws_lambda_function" "create_product" {
  function_name = "create-product"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "createProduct.handler"
  runtime       = "nodejs18.x"
  filename      = "../dist/create-products.zip"
  source_code_hash = filebase64sha256("../dist/create-products.zip")
  timeout       = 10

  environment {
    variables = {
      JWT_SECRET_KEY      = "supersecret"
      PRODUCT_TABLE_NAME   = var.product_table_name
    }
  }
}


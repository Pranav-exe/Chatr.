provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = "Chatr"
      Environment = var.env
      ManagedBy   = "terraform"
    }
  }
}

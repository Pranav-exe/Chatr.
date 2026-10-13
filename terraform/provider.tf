provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = "Chatr"
      Environment = "Dev"
      ManagedBy   = "terraform"
    }
  }
}

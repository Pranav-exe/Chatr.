terraform {
  required_version = ">= 1.10"

  backend "s3" {
    bucket       = "pranav-tfstate-975943373864"
    key          = "chatr/eks/terraform.tfstate"
    region       = "ap-south-1"
    encrypt      = true
    use_lockfile = true
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.66.0"
    }
  }
}

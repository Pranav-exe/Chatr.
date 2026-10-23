resource "aws_ecr_repository" "app" {
  for_each             = toset(["chatr-backend", "chatr-nginx"])
  name                 = each.key
  image_tag_mutability = "IMMUTABLE"
  force_delete         = false

  image_scanning_configuration {
    scan_on_push = true
  }
}

output "cluster_name" {
  value = module.cluster.cluster_name
}

output "oidc_provider_arn" {
  value = module.cluster.oidc_provider_arn
}

output "configure_kubectl" {
  value = "aws eks update-kubeconfig --region ${var.aws_region} --name ${module.cluster.cluster_name}"
}

module "network" {
  source = "./modules/network"

  cluster_name        = var.cluster_name
  vpc_cidr            = var.vpc_cidr
  private_subnet_cidr = var.private_subnet_cidr
  public_subnet_cidr  = var.public_subnet_cidr
}

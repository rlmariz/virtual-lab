data "aws_ami" "amazon_linux_2" {
  most_recent = true

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-ebs"]
  }

  owners = ["amazon"]

}

resource "aws_instance" "server" {
  ami                    = data.aws_ami.amazon_linux_2.id
  instance_type          = var.instance_type
  key_name               = "aws_key"
  vpc_security_group_ids = [aws_security_group.allow_ssh.id]

  tags = {
    Name        = var.name
    Environment = var.env
    Provisioner = "Terraform"
  }

  #docker-compose up -d executado duas vezes por que na primeira da um erro
  user_data = <<-EOF
    #!/bin/bash
    set -ex
    sudo yum update -y
    sudo amazon-linux-extras install docker -y
    sudo service docker start
    sudo usermod -a -G docker ec2-user
    sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    sudo yum install git -y
    cd /home
    sudo git clone https://github.com/rlmariz/virtual-lab-deploy.git virtuallab
    cd /home/virtuallab
    sudo chown -R 1000:1000 ./node-red-data
    sudo setfacl --modify user:$USER:rw /var/run/docker.sock
    docker-compose up -d
  EOF

}

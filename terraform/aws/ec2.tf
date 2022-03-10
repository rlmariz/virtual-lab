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

  # user_data = <<-EOF
  #   #!/bin/bash
  #   set -ex
  #   sudo yum update -y
  #   sudo amazon-linux-extras install docker -y
  #   sudo service docker start
  #   sudo usermod -a -G docker ec2-user
  #   sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
  #   sudo chmod +x /usr/local/bin/docker-compose
  #   sudo yum install git -y
  #   cd /home
  #   sudo git clone https://github.com/rlmariz/virtual-lab-deploy.git virtuallab
  #   cd /home/virtuallab
  #   sudo chown -R 1000:1000 ./node-red-data
  #   sudo setfacl --modify user:$USER:rw /var/run/docker.sock
  #   docker-compose up -d
  # EOF

  provisioner "remote-exec" {
    inline = [
      "set -ex",
      "sudo yum update -y",
      "sudo amazon-linux-extras install docker -y",
      "sudo service docker start",
      "sudo usermod -a -G docker ec2-user",
      "sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose",
      "sudo chmod +x /usr/local/bin/docker-compose",
      "sudo yum install git -y",
      "cd /home",
      "sudo git clone https://github.com/rlmariz/virtual-lab-deploy.git virtuallab",
      "cd /home/virtuallab",
      "sudo chown -R 1000:1000 ./node-red-data",
      "sudo setfacl --modify user:$USER:rw /var/run/docker.sock",
      "docker-compose up -d",
      "sleep 45s",
      "sudo mv all-databases.sql ./scadalts-data",
      "docker exec -i mysql sh -c 'exec mysql -uroot -proot -f < /var/lib/mysql/all-databases.sql'",
      "docker stop scadalts",
      "docker start scadalts",
      "docker cp ./uploads/5.png scadalts:/usr/local/tomcat/webapps/Scada-LTS/uploads/5.png"
    ]
  }
  connection {
    type        = "ssh"
    host        = self.public_ip
    user        = "ec2-user"
    private_key = file("./aws_key")
    timeout     = "4m"
  }

}

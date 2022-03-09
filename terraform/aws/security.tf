resource "aws_security_group" "allow_ssh" {

  name        = "allow_ssh"
  description = "Allow SSH inbound traffic"


  egress = [
    {
      cidr_blocks      = ["0.0.0.0/0", ]
      description      = ""
      from_port        = 0
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      protocol         = "-1"
      security_groups  = []
      self             = false
      to_port          = 0
    }
  ]

  ingress = [
    {
      cidr_blocks      = ["0.0.0.0/0", ]
      description      = "ssh"
      from_port        = 22
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      protocol         = "tcp"
      security_groups  = []
      self             = false
      to_port          = 22
    },
    {
      cidr_blocks      = ["0.0.0.0/0", ]
      description      = "nodered"
      from_port        = 1880
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      protocol         = "tcp"
      security_groups  = []
      self             = false
      to_port          = 1880
    }
  ]
}

resource "aws_key_pair" "deployer" {
  key_name   = "aws_key"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDIbPM13ce5rcI93kYObeMM0i06pMzWq1vqMohJbjwABzadD225wu9W2r50ZWcvw/DZjRQALSnrezBpxwKnsXoHnwPrDqQc2P69HviGuo+8VUGlRq+w3zu+sy0gzScDpnH2GpGrjGM7NCW1XpDZzeXR5my6JBAndmOuKPHYlUfmOA4rvvrek73RFgy9+Cak0U4chjynblS/ARYq76oARHycukxkA6tWAce2ap4W7FMIgVZcaTWnND7ONCuRrj6j//duo8QdhTs8w0Olv6JkaNHl3tu/kbs8Lz7WNPGvj0ZAtqTmQlzcSB8Q52MQO+Kvu649fFT40nqCdvbxgcQB3VQl ricardo@Ricardo-Note"
}

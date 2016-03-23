# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure(2) do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  config.vm.box = "ubuntu/trusty64"

  # Disable automatic box update checking. If you disable this, then
  # boxes will only be checked for updates when the user runs
  # `vagrant box outdated`. This is not recommended.
  # config.vm.box_check_update = false

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
   config.vm.network "forwarded_port", guest: 3000, host: 8081

   # allow creation of symlinks on windows host
   # see: https://github.com/npm/npm/issues/7308#issuecomment-84214837
   # see also: http://perrymitchell.net/article/npm-symlinks-through-vagrant-windows/
   # note long path names issues is solved in recent npm
   # symlink issue may be avoided by running console as admin;
   # though that may then require provisioning the vagrant box twice:
   # both as admin and non-admin users :/
   config.vm.provider "virtualbox" do |v|
       v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
     end

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  # config.vm.network "private_network", ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  # config.vm.synced_folder "../data", "/vagrant_data"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  # config.vm.provider "virtualbox" do |vb|
  #   # Display the VirtualBox GUI when booting the machine
  #   vb.gui = true
  #
  #   # Customize the amount of memory on the VM:
  #   vb.memory = "1024"
  # end
  #
  # View the documentation for the provider you are using for more
  # information on available options.
  #
  #
  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and use.
  config.vm.provision "shell", inline: <<-SHELL

    sudo apt-get update
    sudo apt-get install -y build-essential

    # install Node
    curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -

    sudo apt-get install -y nodejs

    # optionally move "node_modules" out of the synced folder and onto the VM
    # see: http://jmfeurprier.com/2015/10/02/how-to-install-node-js-with-ubuntu-and-vagrant-in-a-synced-folder/
    # NOTE: on Windows this requires the console to be run as admin
    # mkdir /home/vagrant/node_modules
    # cd /var/www/project
    # ln -s /home/vagrant/node_modules/ node_modules

    # install global dependencies
    # have to be sudo to install these...
    sudo npm install -g gulp
    sudo npm install -g gulp-cli
    sudo npm install -g node-sass


    echo "cd /vagrant" >> /home/vagrant/.bashrc

    # install local dependencies
    # cd /vagrant
    # sudo npm install

   SHELL
end

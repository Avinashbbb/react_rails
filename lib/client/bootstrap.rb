module Client
  class Bootstrap
    def self.run
      # admins = [
      #     ['npineault@fungo.ca', 'Nicolas Pineault'],
      #     ['rgagnon@fungo.ca', 'Rémi Gagnon']
      # ]
      #
      # managers = [
      #     ['nolinmariefrance@gmail.com', 'Marie-France Nolin'],
      #     ['mlitalien@fungo.ca', 'Marc Litalien']
      # ]
      #
      # users = [
      #     ['omonvoisin@fungo.ca', 'Olivier Monvoisin'],
      #     ['ndemers@fungo.ca', 'Nicolas Demers'],
      #     ['ssavoie@fungo.ca', 'Serge Savoie'],
      #     ['nicolas.pineault@gmail.com', 'Nicolas Pineault']
      # ]
      #
      # fungo = Opportunist.create!(name: 'FUNGO', has_write_permission: true)
      # ar = Role.find_by_name(:admin)
      # mr = Role.create(name: :manager)
      # (admins + managers + users).each do |email, name|
      #   u = User.create(email: email, name: name, opportunist: fungo)
      #
      #   u.roles << ar if admins.map {|a| a.first}.include?(email)
      #   u.roles << mr if managers.map {|a| a.first}.include?(email)
      # end
    end
  end
end
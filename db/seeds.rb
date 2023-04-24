ActiveRecord::Base.transaction do
  %w(super_admin admin).each do |name|
    Role.create(name: name)
  end

  user = User.new(email: 'parfait_menage@fungo.ca', password: 'texmex2000', first_name: 'John', last_name: 'Smith')
  user.add_role(:super_admin)
  
  user.save!
end                                             
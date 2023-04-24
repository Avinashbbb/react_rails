require 'jobs/recurrences'

namespace :db do
  namespace :seed do
    desc "seed recurrences"
    task recurrences: :environment do

      infos = [
          {
              franchise: "9425-9330 Quebec Inc.",
              file: "#{Rails.root}/private/parfait_menage_clients.csv"
          },
      ]

      infos.each do |info|
        Jobs::Recurrences.new(info[:franchise], info[:file]).seed
      end

    end
  end
end

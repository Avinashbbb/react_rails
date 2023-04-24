require 'franchises/statement'

# invoke rake task with args like this :  rake 'statement:weekly_deposit[40 2021-05-01 2021-05-01 2021-05-01 2021-05-01 2021-05-01]'
# first params is the franchise_id
# rest is the date

namespace :statement do
  task :weekly_deposit, [:params] =>  :environment do  |t, args|

    params = args.params.split(' ').to_a

    franchise_id = params.first
    dates = params[1..-1]

    dates.each do |d|

      statement = Franchises::Statement.new
      yesterday_date = d.to_date - 1.day

      month_start_at = yesterday_date.beginning_of_month.in_time_zone.to_date

      month_end_at = yesterday_date.end_of_month.in_time_zone.to_date

      scope_start_at = yesterday_date.to_date.beginning_of_week.in_time_zone

      scope_end_at = scope_start_at.to_date.end_of_week.in_time_zone

      franchise = statement.franchises_list.select { |franc| franc[:id] == franchise_id.to_i }.first

      statement.franchise_weekly_deposit(franchise, month_end_at, month_start_at, scope_end_at, scope_start_at)

    end

  end
end

require "active_support/all"
Time.zone = "Eastern Time (US & Canada)"
set :output, 'log/cron_log.log'

every(1.day, at: Time.zone.parse('11:45 pm').utc) do
  rake 'optigo:create_recurrences_jobs'
end

every(:day, at: Time.zone.parse('5:05 am').utc) do
  rake 'optigo:franchises:statements:month'
end

# every(:day, at: Time.zone.parse('5:30 am').utc) do
#   rake 'optigo:franchises:statements:week'
# end

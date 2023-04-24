Optigo.configure do |config|
  config.accounting_adapter = :quickbooks
  config.duplication_delay = 1.day
  config.recurrence_duplication_delay = 2.days
  config.recurrence_creation_delay = 3.months
  config.pending_jobs_visibility_delay = 0.day
end
namespace :optigo do
  task create_recurrent_jobs: :environment do
    CustomerItem.all.each do |customer_item| ## TODO Change scope to query the active customer items
      job_recurrence = customer_item.job_recurrence

      customer_item.jobs << Job.new(job_template: job_recurrence.job_template) if job_recurrence&.occurs_on?(Date.tomorrow)
    end
  end
end

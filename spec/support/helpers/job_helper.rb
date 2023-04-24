module JobHelper
  def click_job_tab
    click_button('Tâches')
  end
  
  def create_job(customer_item_id, job_template, start_date, unit_id)
    job = create(:job, customer_item_id: customer_item_id, customer_location: customer_item.location, job_template: job_template, start_date: start_date)
    create(:assignment, job: job, date: start_date, unit_id: unit_id) unless unit_id.blank?

    job
  end
  
  def expect_page_to_have_job(flow, start_date, status, unit = nil)
    expect(page).to have_content(start_date)
    expect(page).to have_content(flow)
    expect(page).to have_content(status)
    expect(page).to have_content(unit) unless unit.blank?
  end

  def expect_page_not_to_have_job(flow, start_date, status, unit)
    expect(page).not_to have_content(start_date)
    expect(page).not_to have_content(flow)
    expect(page).not_to have_content(status)
    expect(page).not_to have_content(unit)
  end
end
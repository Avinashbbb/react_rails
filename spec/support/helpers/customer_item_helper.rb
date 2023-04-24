module CustomerItemHelper
  def create_customer_item(customer_id, contract_no, name, start_date, with_jobs = false)
    contract = create(:contract, contract_no: contract_no, customer_id: customer_id, start_date: start_date)
    accounting_item = create(:accounting_item, contract_id: contract.id, name: name)
    
    customer_item = create(:customer_item, accounting_item: accounting_item, contract: contract, customer_id: customer_id, name: name, start_date: start_date)

    create_list(:job, 2, customer_item: customer_item, job_template: create(:job_template)) unless with_jobs.blank?

    customer_item
  end

  def expect_page_to_have_customer_item(customer_name, contract_no, name, start_date)
    expect(page).to have_content(customer_name)
    expect(page).to have_content(contract_no)
    expect(page).to have_content(name)
    expect(page).to have_content(start_date)
  end

  def expect_page_not_to_have_customer_item(customer_name, contract_no, name, start_date)
    expect(page).not_to have_content(customer_name)
    expect(page).not_to have_content(contract_no)
    expect(page).not_to have_content(name)
    expect(page).not_to have_content(start_date)
  end
end
require 'rails_helper'

RSpec.feature 'Features - Preparation jobs', :js do
  given(:accounting_item) {create(:accounting_item, contract_id: contract.id)}
  given(:contract) {create(:contract, customer_id: customer.id)}
  given(:customer) {create(:customer)}
  given(:customer_item) {create(:customer_item, accounting_item: accounting_item, contract: contract, customer: customer, item: item, location: location)}
  given(:item) {create_item('1111', :container, 'spec1')}
  given(:intervention_template) {create(:intervention_template, job_template: job_template1, kind: :pickup, display_order: 1)}
  given(:job_template1) {create(:job_template, kind: kind1)}
  given(:job_template2) {create(:job_template, kind: kind2)}
  given(:kind1) {'L'}
  given(:kind2) {'VR'}
  given(:location) {create_location(customer.id, 'RUE DES LOUTRES DE MER', 'QC', '2222', 'A1', 'G1G1G1', 'QC')}
  given(:start_date1) {Date.today}
  given(:start_date2) {Date.yesterday}
  given(:unit1) {create(:unit, name: 'A')}
  given(:unit2) {create(:unit, name: 'B')}
  given(:user) {create(:user)}

  background {
    login_as(user)
  }

  scenario 'The page title is visible' do
    visit(customer_item_preparation_path(customer_item.id))
    click_job_tab

    expect(page).to have_content('Préparation')
  end

  scenario 'The jobs list is visible' do
    ## jobs creation
    job1 = create_job(customer_item.id, job_template1, start_date1, unit1.id)
    job2 = create_job(customer_item.id, job_template2, start_date2, unit2.id)
    job3 = create_job(customer_item.id, job_template2, start_date2, unit2.id)

    create(:intervention, intervention_template: intervention_template, job: job1, start_time: DateTime.now - 1.hour, end_time: DateTime.now)
    create(:intervention, intervention_template: intervention_template, job: job2, start_time: DateTime.now - 1.hour)
    create(:intervention, intervention_template: intervention_template, job: job3)

    visit(customer_item_preparation_path(customer_item.id))
    click_job_tab

    ## the first job should be visible
    expect_page_to_have_job(kind1, start_date1, 'Terminée', unit1.name)

    ## the second job should be visible
    expect_page_to_have_job(kind2, start_date2, 'En cours', unit2.name)

    ## the third job should be visible
    expect(page).to have_content('À faire')
  end

  scenario 'The jobs list is filterable' do
    ## contacts job
    job1 = create_job(customer_item.id, job_template1, start_date1, unit1.id)
    job2 = create_job(customer_item.id, job_template2, start_date2, unit2.id)

    create(:intervention, intervention_template: intervention_template, job: job1, start_time: DateTime.now - 1.hour, end_time: DateTime.now)
    create(:intervention, intervention_template: intervention_template, job: job2, start_time: DateTime.now - 1.hour)

    visit(customer_item_preparation_path(customer_item.id))
    click_job_tab

    ## the first job should be visible
    expect_page_to_have_job(kind1, start_date1, 'Terminée', unit1.name)

    ## the second job should be visible
    expect_page_to_have_job(kind2, start_date2, 'En cours', unit2.name)

    fill_in(:'cpbr-filtre', with: kind1)

    ## the first job should still be visible
    expect_page_to_have_job(kind1, start_date1, 'Terminée', unit1.name)

    ## the second job should not be visible anymore
    expect_page_not_to_have_job(kind2, start_date2, 'En cours', unit2.name)
  end

  scenario 'The customer items list is sortable' do
    ## jobs creation
    job1 = create_job(customer_item.id, job_template1, start_date1, unit1.id)
    job2 = create_job(customer_item.id, job_template2, start_date2, unit2.id)

    create(:intervention, intervention_template: intervention_template, job: job1, start_time: DateTime.now - 1.hour, end_time: DateTime.now)
    create(:intervention, intervention_template: intervention_template, job: job2, start_time: DateTime.now - 1.hour)

    visit(customer_item_preparation_path(customer_item.id))
    click_job_tab

    first_row = 'tbody tr:nth-child(1)'

    ## the first row should be the first job
    within(first_row) {
      expect_page_to_have_job(kind1, start_date1, 'Terminée', unit1.name)
    }

    ## sorting the "Flow" column to be in descending order
    element = page.first('span', text: 'Flow')
    element.click
    element.click

    ## the first row should now be the second job
    within(first_row) {
      expect_page_to_have_job(kind2, start_date2, 'En cours', unit2.name)
    }
  end

  context 'pagination' do
    scenario 'the number of row per page can be modified' do
      kinds = %w(A1 B2 C3 D4 E5 F6)

      ## jobs creation
      kinds.each do |kind|
        job_template = create(:job_template, kind: kind)
        
        create_job(customer_item.id, job_template, start_date1, unit1.id)
      end

      visit(customer_item_preparation_path(customer_item.id))
      click_job_tab

      ## all jobs should be on the first page
      kinds.each do |kind|
        expect_page_to_have_job(kind, start_date1, 'Terminée', unit1.name)
      end

      ## click on the rows per page select
      within('#cpbr-pagination') do
        page.find('div[role=button]', text: '10', exact_text: true).click
      end

      ## select 5 rows per page
      page.find('li[role=option]', text: '5', exact_text: true).click

      ## the 6th job should not be visible anymore
      expect(page).not_to have_content('F6')
    end

    scenario 'page can be changed' do
      kinds = %w(A1 B2 C3 D4 E5 F6 G7 H8 I9 J10)
      last_kind = 'K11'

      ## jobs creation
      kinds.each do |kind|
        job_template = create(:job_template, kind: kind)

        create_job(customer_item.id, job_template, start_date1, unit1.id)
      end

      job_template = create(:job_template, kind: last_kind)
      create_job(customer_item.id, job_template, start_date2, unit2.id)

      visit(customer_item_preparation_path(customer_item.id))
      click_job_tab

      ## all jobs except the last one should be on the first page
      kinds.each do |kind|
        expect(page).to have_content(kind)
      end

      ## the last job should not be on the first page
      expect(page).not_to have_content(last_kind)

      ## click on the page change icon
      within('#cpbr-pagination') do
        page.find('[type="button"][tabindex="0"]').click
      end

      ## all jobs except the last one should not be on the new page
      kinds.each do |kind|
        expect(page).not_to have_content(kind)
      end

      ## the last job should be on the new page
      expect(page).to have_content(last_kind)
    end
  end

  context 'Jobs can be edited' do
    xscenario 'fields are validated' do
    end

    xscenario 'the edited contact appears in the list' do
    end
  end

  context 'Jobs can be deleted' do
    scenario 'Unplanned jobs can be deleted' do
      ## jobs creation
      job1 = create_job(customer_item.id, job_template1, start_date1, unit1.id)
      job2 = create_job(customer_item.id, job_template2, start_date2, nil)

      create(:intervention, intervention_template: intervention_template, job: job1, start_time: DateTime.now - 1.hour, end_time: DateTime.now)
      create(:intervention, intervention_template: intervention_template, job: job2)

      visit(customer_item_preparation_path(customer_item.id))
      click_job_tab

      ## the first customer item should be visible
      expect_page_to_have_job(kind1, start_date1, 'Terminée', unit1.name)

      ## the second customer item should be visible
      expect_page_to_have_job(kind2, start_date2, 'À faire')

      expect(page).to have_css('button#cpbr-delete-job', count: 1)

      click_button('cpbr-delete-job')
      click_button('Continuer')

      ## the second customer item should not be visible anymore
      expect_page_not_to_have_job(kind2, start_date2, 'À faire', unit2.name)

      ## the first customer item should be visible
      expect_page_to_have_job(kind1, start_date1, 'Terminée', unit1.name)
    end
  end
end
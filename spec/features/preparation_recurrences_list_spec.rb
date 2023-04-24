require 'rails_helper'

RSpec.feature 'Features - Preparation recurrences', :js do
  given(:accounting_item) {create(:accounting_item, contract_id: contract.id)}
  given(:contract) {create(:contract, customer_id: customer.id)}
  given(:customer) {create(:customer)}
  given(:customer_item) {create(:customer_item, accounting_item: accounting_item, contract: contract, customer: customer, item: item)}
  given(:item) {create_item('1111', :container, 'spec1')}
  given(:job_template1) {create(:job_template, code: :LD)}
  given(:job_template2) {create(:job_template, code: :VR)}
  given(:schedule1) {"{\"start_time\":\"2018-10-11T07:25:58.000-04:00\",\"rrules\":[{\"validations\":{\"day_of_month\":[1]},\"rule_type\":\"IceCube::MonthlyRule\",\"interval\":1}],\"rtimes\":[],\"extimes\":[]}"}
  given(:schedule1_as_words) {'Mensuel les 1° jours du mois'}
  given(:schedule2) {"{\"start_time\":\"2018-10-11T07:25:58.000-04:00\",\"rrules\":[{\"validations\":{\"day_of_month\":[2]},\"rule_type\":\"IceCube::MonthlyRule\",\"interval\":1}],\"rtimes\":[],\"extimes\":[]}"}
  given(:schedule2_as_words) {'Mensuel les 2° jours du mois'}
  given(:unit1) {create(:unit, name: :U1)}
  given(:unit2) {create(:unit, name: :U2)}
  given(:user) {create(:user)}

  background {
    login_as(user)
  }

  scenario 'The page title is visible' do
    visit(customer_item_preparation_path(customer_item.id))
    click_recurrences_tab

    expect(page).to have_content('Préparation')
  end

  scenario 'The recurrences list is visible' do
    ## recurrences creation
    job1 = create(:job, customer_item: customer_item, job_template: job_template1)
    create(:assignment, job: job1, unit: unit1)
    recurrence1 = create(:recurrence, recurrable: job1, schedule: schedule1, start_date: Date.today - 1.day)

    job2 = create(:job, customer_item: customer_item, job_template: job_template2)
    create(:assignment, job: job2, unit: unit2)
    recurrence2 = create(:recurrence, recurrable: job2, schedule: schedule2, start_date: Date.today + 1.day)

    visit(customer_item_preparation_path(customer_item.id))
    click_recurrences_tab

    ## the first recurrence should be visible
    expect(page).to have_content(recurrence1.start_date)
    expect(page).to have_content(job1.code)
    expect(page).to have_content(schedule1_as_words)
    expect(page).to have_content(unit1.name)

    ## the second recurrence should be visible
    expect(page).to have_content(recurrence2.start_date)
    expect(page).to have_content(job2.code)
    expect(page).to have_content(schedule2_as_words)
    expect(page).to have_content(unit2.name)
  end

  scenario 'The recurrences list is filterable' do
    ## recurrences creation
    job1 = create(:job, customer_item: customer_item, job_template: job_template1)
    create(:assignment, job: job1, unit: unit1)
    recurrence1 = create(:recurrence, recurrable: job1, schedule: schedule1, start_date: Date.today - 1.day)

    job2 = create(:job, customer_item: customer_item, job_template: job_template2)
    create(:assignment, job: job2, unit: unit2)
    recurrence2 = create(:recurrence, recurrable: job2, schedule: schedule2, start_date: Date.today + 1.day)

    visit(customer_item_preparation_path(customer_item.id))
    click_recurrences_tab

    ## the first recurrence should be visible
    expect(page).to have_content(recurrence1.start_date)
    expect(page).to have_content(job1.code)
    expect(page).to have_content(schedule1_as_words)
    expect(page).to have_content(unit1.name)

    ## the second recurrence should be visible
    expect(page).to have_content(recurrence2.start_date)
    expect(page).to have_content(job2.code)
    expect(page).to have_content(schedule2_as_words)
    expect(page).to have_content(unit2.name)

    fill_in(:'cpbr-filtre', with: job1.code)

    ## the first recurrence should still be visible
    expect(page).to have_content(recurrence1.start_date)
    expect(page).to have_content(job1.code)
    expect(page).to have_content(schedule1_as_words)
    expect(page).to have_content(unit1.name)

    ## the second recurrence should not be visible anymore
    expect(page).not_to have_content(recurrence2.start_date)
    expect(page).not_to have_content(job2.code)
    expect(page).not_to have_content(schedule2_as_words)
    expect(page).not_to have_content(unit2.name)
  end

  scenario 'The customer items list is sortable' do
    ## recurrences creation
    job1 = create(:job, customer_item: customer_item, job_template: job_template1)
    create(:assignment, job: job1, unit: unit1)
    recurrence1 = create(:recurrence, recurrable: job1, schedule: schedule1, start_date: Date.today - 1.day)

    job2 = create(:job, customer_item: customer_item, job_template: job_template2)
    create(:assignment, job: job2, unit: unit2)
    recurrence2 = create(:recurrence, recurrable: job2, schedule: schedule2, start_date: Date.today + 1.day)

    visit(customer_item_preparation_path(customer_item.id))
    click_recurrences_tab

    first_row = 'tbody tr:nth-child(1)'

    ## the first row should be the first recurrence
    within(first_row) {
      expect(page).to have_content(recurrence1.start_date)
      expect(page).to have_content(job1.code)
      expect(page).to have_content(schedule1_as_words)
      expect(page).to have_content(unit1.name)
    }

    ## sorting the "Flow" column to be in descending order
    element = page.first('span', text: 'Flow')
    element.click
    element.click

    ## the first row should now be the second recurrence
    within(first_row) {
      expect(page).to have_content(recurrence2.start_date)
      expect(page).to have_content(job2.code)
      expect(page).to have_content(schedule2_as_words)
      expect(page).to have_content(unit2.name)
    }
  end

  context 'pagination' do
    scenario 'the number of row per page can be modified' do
      codes = %w(A1 B2 C3 D4 E5 F6)

      ## recurrences creation
      codes.each do |code|
        job_template = create(:job_template, code: code)
        job = create(:job, customer_item: customer_item, job_template: job_template)

        create(:recurrence, recurrable: job, schedule: schedule1)
      end

      visit(customer_item_preparation_path(customer_item.id))
      click_recurrences_tab

      ## all recurrences should be on the first page
      codes.each do |code|
        expect(page).to have_content(code)
      end

      ## click on the rows per page select
      within('#cpbr-pagination') do
        page.find('div[role=button]', text: '10', exact_text: true).click
      end

      ## select 5 rows per page
      page.find('li[role=option]', text: '5', exact_text: true).click

      ## the 6th recurrence should not be visible anymore
      expect(page).not_to have_content('F6')
    end

    scenario 'page can be changed' do
      codes = %w(A1 B2 C3 D4 E5 F6 G7 H8 I9 J10)
      last_code = 'K11'

      ## recurrences creation
      codes.each do |code|
        job_template = create(:job_template, code: code)
        job = create(:job, customer_item: customer_item, job_template: job_template)

        create(:recurrence, recurrable: job, schedule: schedule1)
      end

      job_template = create(:job_template, code: last_code)
      job = create(:job, customer_item: customer_item, job_template: job_template)
      
      create(:recurrence, recurrable: job, schedule: schedule1)

      visit(customer_item_preparation_path(customer_item.id))
      click_recurrences_tab

      ## all recurrences except the last one should be on the first page
      codes.each do |code|
        expect(page).to have_content(code)
      end

      ## the last recurrence should not be on the first page
      expect(page).not_to have_content(last_code)

      ## click on the page change icon
      within('#cpbr-pagination') do
        page.find('[type="button"][tabindex="0"]').click
      end

      ## all recurrences except the last one should not be on the new page
      codes.each do |code|
        expect(page).not_to have_content(code)
      end

      ## the last recurrence should be on the new page
      expect(page).to have_content(last_code)
    end
  end

  context 'recurrences can be edited' do
    xscenario 'fields are validated' do
    end

    xscenario 'the edited recurrence appears in the list' do
    end
  end

  context 'recurrences can be deleted' do
    xscenario 'Unplanned recurrences can be deleted' do
    end
  end
end
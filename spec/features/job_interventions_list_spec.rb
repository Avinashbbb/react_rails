require 'rails_helper'

RSpec.feature 'Features - Preparation jobs', :js do
  let(:accounting_item) {create(:accounting_item, contract: contract)}
  let(:contract) {create(:contract, customer: customer.becomes(Client::Customer))}
  let(:customer) {create(:customer)}
  let(:customer_item) {create(:customer_item, accounting_item: accounting_item, contract: contract, customer: customer)}
  let(:job) {create(:job, customer_item: customer_item, job_template: job_template)}
  let(:job_template) {create(:job_template)}
  let(:user) {create(:user)}

  background {
    login_as(user)
  }

  scenario 'The page title is visible' do
    visit(job_path(job.id))

    expect(page).to have_content('Tâches')
  end

  context 'The interventions list is visible' do
    scenario 'the intervention is has not been started' do
      create(:intervention_template, job_template: job_template, kind: :ROUTE, display_order: 1, location_kind: :CUSTOMER)

      visit(job_path(job.id))

      expect(page).to have_selector('span.cpbr-no-data', count: 3)
    end

    scenario 'the intervention is currently being done' do
      start_time = DateTime.now - 1.hour
      
      create(:intervention_template, job_template: job_template, kind: :ROUTE, display_order: 1, location_kind: :CUSTOMER)
      job.interventions.first.update(start_time: start_time)
      
      visit(job_path(job.id))

      expect(page).to have_content(I18n.localize(start_time, format: '%-d %B %Y'))
      expect(page).to have_content(start_time.strftime('%H:%M'))
      expect(page).to have_selector('span.cpbr-in-progress', text: '60', count: 1)
    end

    scenario 'the intervention has been done' do
      start_time = DateTime.now - 1.hour

      create(:intervention_template, job_template: job_template, kind: :ROUTE, display_order: 1, location_kind: :CUSTOMER)
      job.interventions.first.update(start_time: start_time, end_time: DateTime.now)

      visit(job_path(job.id))

      expect(page).to have_content(I18n.localize(start_time, format: '%-d %B %Y'))
      expect(page).to have_content(start_time.strftime('%H:%M'))
      expect(page).to have_content('60')
      expect(page).not_to have_selector('span.cpbr-in-progress')
    end

    scenario 'the intervention is a route' do
      create(:intervention_template, job_template: job_template, kind: :ROUTE, display_order: 1, location_kind: :CUSTOMER)

      visit(job_path(job.id))

      expect(page).to have_content('Déplacement')
    end

    scenario 'the intervention is a work' do
      create(:intervention_template, job_template: job_template, kind: :WORK, display_order: 1, location_kind: :CUSTOMER)

      visit(job_path(job.id))

      expect(page).to have_content('Travail')
    end

    scenario 'the intervention is a work' do
      create(:intervention_template, job_template: job_template, kind: :WORK, display_order: 1, location_kind: :CUSTOMER)

      visit(job_path(job.id))

      expect(page).to have_content('Travail')
    end

    scenario 'the intervention\'s location is set' do
      location = create(:location, locatable: customer, name: 'Emplacement A')
      create(:intervention_template, job_template: job_template, kind: :ROUTE, display_order: 1, location_kind: :CUSTOMER)

      job = create(:job, customer_item: customer_item, customer_location_id: location.id, job_template: job_template)

      visit(job_path(job.id))

      expect(page).to have_content(location.name)
    end

    scenario 'the intervention\'s location is not set' do
      create(:intervention_template, job_template: job_template, kind: :ROUTE, display_order: 1, location_kind: :CUSTOMER)

      visit(job_path(job.id))

      expect(page).to have_content('Non sélectionné')
    end
  end
end
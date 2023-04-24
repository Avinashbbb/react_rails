require 'rails_helper'

RSpec.feature 'Features - Preparation jobs', :js do
  let(:accounting_item) {create(:accounting_item, contract: contract)}
  let(:contract) {create(:contract, customer: customer.becomes(Client::Customer))}
  let(:customer) {create(:customer)}
  let(:customer_item) {create(:customer_item, accounting_item: accounting_item, contract: contract, customer: customer)}
  let(:job_template) {create(:job_template)}
  let(:user) {create(:user)}

  background {
    login_as(user)
  }

  scenario 'The page title is visible' do
    create(:intervention_template, job_template: job_template, display_order: 1)
    job = create(:job, customer_item: customer_item, job_template: job_template)
    intervention = job.interventions.first
    create(:interruption, intervention: intervention, kind: :A, reason: :B, comment: :C)

    visit(job_path(job.id))
    click_button('Interruption')

    expect(page).to have_content('Tâches')
  end

  scenario 'The interruption infos are visible' do
    create(:intervention_template, job_template: job_template, display_order: 1)
    job = create(:job, customer_item: customer_item, job_template: job_template)
    intervention = job.interventions.first
    interruption = create(:interruption, intervention: intervention, kind: :A11, reason: :B22, comment: :C33)

    visit(job_path(job.id))
    click_button('Interruption')

    expect(page).to have_content(interruption.kind)
    expect(page).to have_content(interruption.reason)
    expect(page).to have_content(interruption.comment)
    expect(page).to have_selector('img[src="/photos/original/missing.png"]')
  end
end
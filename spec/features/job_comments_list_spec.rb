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
    job = create(:job, customer_item: customer_item, job_template: job_template)

    visit(job_path(job.id))
    click_button('Commentaires')

    expect(page).to have_content('Tâches')
  end

  scenario 'The interventions list is visible' do
    job = create(:job, customer_item: customer_item, job_template: job_template)
    comment1 = create(:comment, commentable: job, comment: 'comment1')
    comment2 = create(:comment, commentable: job, comment: 'comment2', created_at: comment1.created_at - 1.hour)

    visit(job_path(job.id))
    click_button('Commentaires')

    expect(page).to have_content(comment1.comment)
    expect(page).to have_content(I18n.localize(comment1.created_at, format: '%H:%M'))

    expect(page).to have_content(comment2.comment)
    expect(page).to have_content(I18n.localize(comment2.created_at, format: '%H:%M'))

    expect(page).to have_selector('#cpbr-badge-comments-count', text: "COMMENTAIRES\n2")
  end
end
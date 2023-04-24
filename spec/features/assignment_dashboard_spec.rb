require 'rails_helper'

RSpec.feature 'Features - Dashboard', :js do
  given(:accounting_item) {create(:accounting_item, contract_id: contract.id)}
  given(:container_kind) {create(:container_kind, name: 'Matériaux secs')}
  given(:contract) {create(:contract, customer_id: customer.id)}
  given(:customer) {create(:customer)}
  given(:customer_item) {create(:customer_item, accounting_item: accounting_item, container_kind: container_kind, contract: contract, customer: customer, item: item, location: location)}
  given(:item) {create_item('1111', :container, 'spec1')}
  given(:job_template) {create(:job_template, kind: kind)}
  given(:kind) {'VR'}
  given(:location) {create_location(customer.id, 'RUE DES LOUTRES DE MER', 'QC', '2222', 'A1', 'G1G1G1', 'QC')}
  given(:today) {Date.today}
  given(:user) {create(:user)}

  background {
    login_as(user)
  }

  scenario 'The number of unassigned tasks is visible' do
    3.times do
      create_job(customer_item.id, job_template, today, nil)
    end

    visit('/')

    expect(page).to have_content('Tâches (3)')
  end

  scenario 'The tasks icebox is visible' do
    create_job(customer_item.id, job_template, today, nil)

    visit('/')

    expect(page).to have_content(container_kind.name)
    expect(page).to have_content(kind)
    expect(page).to have_content('A1')
    expect(page).to have_content('2222 RUE DES LOUTRES DE MER, QC')
  end

  context 'Units selection' do
    scenario 'Units can be selected' do
      unit_a = create(:unit, name: 'A')
      unit_b = create(:unit, name: 'B')

      unit_a_id = "#cpbr-unit#{unit_a.id}"
      unit_b_id = "#cpbr-unit#{unit_b.id}"

      visit('/')

      expect(page).to have_css(unit_a_id, count: 1)
      expect(page).to have_css(unit_b_id, count: 1)

      first('span', text: 'Toutes les unités').click
      first('li', text: unit_b.name).click

      expect(page).to have_css(unit_a_id, count: 1)
      expect(page).to have_css(unit_b_id, count: 0)
    end

    scenario 'All units can be selected at once' do
      unit_a = create(:unit, name: 'A')
      unit_b = create(:unit, name: 'B')

      unit_a_id = "#cpbr-unit#{unit_a.id}"
      unit_b_id = "#cpbr-unit#{unit_b.id}"

      visit('/')

      expect(page).to have_css(unit_a_id, count: 1)
      expect(page).to have_css(unit_b_id, count: 1)

      first('span', text: 'Toutes les unités').click
      first('span', text: 'Tout sélectionner').click

      expect(page).to have_css(unit_a_id, count: 0)
      expect(page).to have_css(unit_b_id, count: 0)
    end
  end

  xscenario 'Jobs are assignable' do
    unit = create(:unit, name: 'A')
    job = create_job(customer_item.id, job_template, today, nil)

    visit('/')

    draggable = find("#cpbr-draggable-job-#{job.id}")
    droppable = find("#cpbr-droppable-unit-#{unit.id}")

    draggable.drag_to(droppable)

    find('span', text: '1', exact_text: true)

    job.reload

    expect(job.assignment).not_to be_nil
  end

  context 'Jobs publishing' do
    scenario 'A unit\'s jobs are publishable' do
      unit = create(:unit, name: 'A')
      job = create_job(customer_item.id, job_template, today, unit.id)

      badge_id = "#cpbr-unpublished-unit-#{unit.id}"

      expect(job.assignment.published).to be_falsey

      visit('/')

      badge = find(badge_id)
      expect(badge.text).to eq("tap_and_play\n1")
      badge.click

      expect(page).not_to have_css(badge_id)

      job.reload

      expect(job.assignment.published).to be_truthy
    end

    scenario 'All assigned jobs are publishable' do
      unit_a = create(:unit, name: 'A')
      unit_b = create(:unit, name: 'B')
      job_a = create_job(customer_item.id, job_template, today, unit_a.id)
      job_b = create_job(customer_item.id, job_template, today, unit_b.id)
      job_c = create_job(customer_item.id, job_template, today, unit_b.id)

      badge_a_id = "#cpbr-unpublished-unit-#{unit_a.id}"
      badge_b_id = "#cpbr-unpublished-unit-#{unit_b.id}"

      [job_a, job_b, job_c].each do |job|
        expect(job.assignment.published).to be_falsey
      end

      visit('/')

      badge_a = find(badge_a_id)
      badge_b = find(badge_b_id)
      expect(badge_a.text).to eq("tap_and_play\n1")
      expect(badge_b.text).to eq("tap_and_play\n2")

      find('#cpbr-unpublished-all').click

      [badge_a_id, badge_b_id].each do |badge_id|
        expect(page).not_to have_css(badge_id)
      end

      [job_a, job_b, job_c].each do |job|
        job.reload

        expect(job.assignment.published).to be_truthy
      end
    end
  end

  scenario 'The dashboard is refreshable' do
    visit('/')

    expect(page).not_to have_css('.cpbr-jobs')

    create_job(customer_item.id, job_template, today, nil)
    find('#cpbr-refresh').click

    expect(page).to have_css('.cpbr-jobs')
  end

  scenario 'The dashboard is navigable ' do
    job_assignment_date = today + 1.day
    
    create_job(customer_item.id, job_template, job_assignment_date, nil)

    visit('/')

    expect(page).not_to have_css('.cpbr-jobs')

    find('#cpbr-date').click
    click_button(job_assignment_date.day)

    expect(page).to have_css('.cpbr-jobs')
  end
end
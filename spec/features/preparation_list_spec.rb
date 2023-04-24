require 'rails_helper'

RSpec.feature 'Features - Preparation list', :js do
  given(:customer1) {create(:customer, name: customer_name1)}
  given(:customer2) {create(:customer, name: customer_name2)}
  given(:contract_no1) {'VLC-8C312'}
  given(:contract_no2) {'VLC-6S619'}
  given(:customer_name1) {'VILLE DE LÉVIS'}
  given(:customer_name2) {'VILLE DE QUÉBEC'}
  given(:name1) {'20 VERGES'}
  given(:name2) {'40 VERGES'}
  given(:start_date1) {today + 5.days}
  given(:start_date2) {today + 10.days}
  given(:today) {Date.today}
  given(:user) {create(:user)}

  background {
    login_as(user)
  }

  scenario 'The page title is visible' do
    visit(preparation_path)

    expect(page).to have_content('Préparation')
  end

  scenario 'The customer items list is visible' do
    ## customer items creation
    create_customer_item(customer1.id, contract_no1, name1, start_date1)
    create_customer_item(customer2.id, contract_no2, name2, start_date2)

    visit(preparation_path)

    ## the first customer item should be visible
    expect_page_to_have_customer_item(customer_name1, contract_no1, name1, start_date1)

    ## the second customer item should be visible
    expect_page_to_have_customer_item(customer_name2, contract_no2, name2, start_date2)
  end

  scenario 'The customer items list is filterable' do
    ## customer items creation
    create_customer_item(customer1.id, contract_no1, name1, start_date1)
    create_customer_item(customer2.id, contract_no2, name2, start_date2)

    visit(preparation_path)

    ## the first customer item should be visible
    expect_page_to_have_customer_item(customer_name1, contract_no1, name1, start_date1)

    ## the second customer item should be visible
    expect_page_to_have_customer_item(customer_name2, contract_no2, name2, start_date2)

    fill_in(:'cpbr-filtre', with: name1)

    ## the first customer item should still be visible
    expect_page_to_have_customer_item(customer_name1, contract_no1, name1, start_date1)

    ## the second customer item should not be visible anymore
    expect_page_not_to_have_customer_item(customer_name2, contract_no2, name2, start_date2)
  end

  context 'The customer items list is filterable by a days range' do
    given(:customer3) {create(:customer, name: customer_name3)}
    given(:customer_name3) {'VILLE DE L\'ANCIENNE LORETTE'}
    given(:contract_no3) {'VLC-02B67'}
    given(:name3) {'60 VERGES'}
    given(:start_date3) {today + 25.days}

    background {
      ## customer items creation
      create_customer_item(customer1.id, contract_no1, name1, start_date1)
      create_customer_item(customer2.id, contract_no2, name2, start_date2)
      create_customer_item(customer3.id, contract_no3, name3, start_date3)

      visit(preparation_path)

      ## the first customer item should be visible
      expect_page_to_have_customer_item(customer_name1, contract_no1, name1, start_date1)

      ## the second customer item should be visible
      expect_page_to_have_customer_item(customer_name2, contract_no2, name2, start_date2)

      ## the third customer item should not be visible
      expect_page_not_to_have_customer_item(customer_name3, contract_no3, name3, start_date3)

      page.find('div[role=button]', text: '14 jours', exact_text: true).click
    }

    scenario 'the customer items with a start date within 7 days from now' do
      within('ul[role=listbox]') do
        all('li')[0].click
      end

      ## the first customer item should still be visible
      expect_page_to_have_customer_item(customer_name1, contract_no1, name1, start_date1)

      ## the second customer item should not be visible anymore
      expect_page_not_to_have_customer_item(customer_name2, contract_no2, name2, start_date2)

      ## the second customer item should still not be visible
      expect_page_not_to_have_customer_item(customer_name3, contract_no3, name3, start_date3)
    end

    scenario 'the customer items with a start date within 14 days from now' do
      within('ul[role=listbox]') do
        all('li')[1].click
      end

      ## the first customer item should still be visible
      expect_page_to_have_customer_item(customer_name1, contract_no1, name1, start_date1)

      ## the second customer item should still be visible
      expect_page_to_have_customer_item(customer_name2, contract_no2, name2, start_date2)

      ## the second customer item should still not be visible
      expect_page_not_to_have_customer_item(customer_name3, contract_no3, name3, start_date3)
    end

    scenario 'the customer items with a start date within 30 days from now' do
      within('ul[role=listbox]') do
        all('li')[2].click
      end

      ## the first customer item should still be visible
      expect_page_to_have_customer_item(customer_name1, contract_no1, name1, start_date1)

      ## the second customer item should still be visible
      expect_page_to_have_customer_item(customer_name2, contract_no2, name2, start_date2)

      ## the second customer item should now be visible
      expect_page_to_have_customer_item(customer_name3, contract_no3, name3, start_date3)
    end
  end

  xscenario 'The customer items list is filterable by status' do
    ## customer items creation
    create_customer_item(customer1.id, name1, start_date1)
    create_customer_item(customer2.id, name2, start_date2)

    visit(preparation_path)

    ## the first customer item should be visible
    expect_page_to_have_customer_item(customer_name1, name1, start_date1)

    ## the second customer item should be visible
    expect_page_to_have_customer_item(customer_name2, name2, start_date2)

    page.find('div[role=button]', text: 'Tous', exact_text: true).click

    within('ul[role=listbox]') do
      first('li').click
    end

    ## the first customer item should still be visible
    expect_page_to_have_customer_item(customer_name1, name1, start_date1)

    ## the second customer item should not be visible anymore
    expect_page_not_to_have_customer_item(customer_name2, name2, start_date2)
  end

  scenario 'The customer items list is sortable' do
    ## customer items creation
    create_customer_item(customer1.id, contract_no1, name1, start_date1)
    create_customer_item(customer2.id, contract_no2, name2, start_date2)

    visit(preparation_path)

    first_row = 'tbody tr:nth-child(1)'

    ## the first row should be the first customer item
    within(first_row) {
      expect_page_to_have_customer_item(customer_name1, contract_no1, name1, start_date1)
    }

    ## sorting the Nom column to be in descending order
    element = page.first('span', text: 'Nom')
    element.click
    element.click

    ## the first row should now be the second customer item
    within(first_row) {
      expect_page_to_have_customer_item(customer_name2, contract_no2, name2, start_date2)
    }
  end

  context 'pagination' do
    scenario 'the number of row per page can be modified' do
      names = %w(A1 B2 C3 D4 E5 F6)

      ## customer items creation
      names.each do |name|
        create_customer_item(customer1.id, contract_no1, name, start_date1)
      end

      visit(preparation_path)

      ## all customer items should be on the first page
      names.each do |name|
        expect_page_to_have_customer_item(customer_name1, contract_no1, name, start_date1)
      end

      ## click on the rows per page select
      within('#cpbr-pagination') do
        page.find('div[role=button]', text: '10', exact_text: true).click
      end

      ## select 5 rows per page
      page.find('li[role=option]', text: '5', exact_text: true).click

      ## the 6th customer item should not be visible anymore
      expect(page).not_to have_content('F6')
    end

    scenario 'page can be changed' do
      names = %w(A1 B2 C3 D4 E5 F6 G7 H8 I9 J10)
      last_name = 'K11'

      ## customer items creation
      names.each do |name|
        create_customer_item(customer1.id, contract_no1, name, start_date1)
      end

      create_customer_item(customer2.id, contract_no2, last_name, start_date2)

      visit(preparation_path)

      ## all customer items except the last one should be on the first page
      names.each do |name|
        expect_page_to_have_customer_item(customer_name1, contract_no1, name, start_date1)
      end

      ## the last customer item should not be on the first page
      expect_page_not_to_have_customer_item(customer_name2, contract_no2, last_name, start_date2)

      ## click on the page change icon
      within('#cpbr-pagination') do
        page.find('[type="button"][tabindex="0"]').click
      end

      ## all customer items except the last one should not be on the new page
      names.each do |name|
        expect_page_not_to_have_customer_item(customer_name1, contract_no1, name, start_date1)
      end

      ## the last customer should be on the new page
      expect_page_to_have_customer_item(customer_name2, contract_no2, last_name, start_date2)
    end
  end

  context 'Customer items can be deleted' do
    scenario 'Unplanned customer items can be deleted' do
      ## customer items creation
      create_customer_item(customer1.id, contract_no1, name1, start_date1)
      create_customer_item(customer2.id, contract_no2, name2, start_date2, true)

      visit(preparation_path)

      ## the first customer item should be visible
      expect_page_to_have_customer_item(customer_name1, contract_no1, name1, start_date1)

      ## the second customer item should be visible
      expect_page_to_have_customer_item(customer_name2, contract_no2, name2, start_date2)

      expect(page).to have_css('button#cpbr-delete-customer-item', count: 1)

      click_button('cpbr-delete-customer-item')
      click_button('Continuer')

      ## the first customer item should not be visible anymore
      expect_page_not_to_have_customer_item(customer_name1, contract_no1, name1, start_date1)

      ## the second customer item should be visible
      expect_page_to_have_customer_item(customer_name2, contract_no2, name2, start_date2)
    end
  end

  context 'preparation' do
    scenario 'the fields are validated' do
      create_customer_item(customer1.id, contract_no1, name1, start_date1)
      
      visit(preparation_path)
      find('#cpbr-prepare').click

      click_button('Enregistrer')

      expect(page).to have_css('p', text: 'Ne peut être vide', count: 2)
    end

    scenario 'the customer item can be prepared' do
      container_kind = create(:container_kind, name: 'Composte')
      item = create_item('1111', :container, '10 verges')
      location = create_location(customer1.id, 'RUE DES LOUTRES DE MER', 'QUEBEC', '2440', 'A1', 'G1B 2G8', 'QC')

      customer_item = create_customer_item(customer1.id, contract_no1, name1, start_date1)
      
      expect(customer_item.container_kind_id).to be_nil
      expect(customer_item.item_id).to be_nil
      expect(customer_item.location_id).to be_nil
      expect(customer_item.note_access).to be_nil
      expect(customer_item.note_before_start).to be_nil
      expect(customer_item.note_comments).to be_nil
      expect(customer_item.note_location).to be_nil
      expect(customer_item.note_schedule).to be_nil
      expect(customer_item.prepared).to be_nil

      visit(preparation_path)
      find('#cpbr-prepare').click

      expect(page).not_to have_selector('.cpbr-prepared')

      select_tag = 'div[role=button]'
      select_options = 'ul[role=listbox]'

      page.find(select_tag, text: 'Sélectionner un emplacement', exact_text: true).click

      within(select_options) do
        all('li')[1].click
      end

      page.find(select_tag, text: 'Sélectionner un type de conteneur', exact_text: true).click

      within(select_options) do
        all('li')[1].click
      end

      page.find(select_tag, text: 'Sélectionner un conteneur', exact_text: true).click

      within(select_options) do
        all('li')[1].click
      end

      fill_in(:'cpbr-noteAccess', with: 'A')
      fill_in(:'cpbr-noteBeforeStart', with: 'B')
      fill_in(:'cpbr-noteComments', with: 'C')
      fill_in(:'cpbr-noteLocation', with: 'D')
      fill_in(:'cpbr-noteSchedule', with: 'E')

      click_button('Enregistrer')

      visit(preparation_path)

      customer_item.reload

      expect(page).to have_selector('.cpbr-prepared')

      expect(customer_item.container_kind_id).to eq(container_kind.id)
      expect(customer_item.item_id).to eq(item.id)
      expect(customer_item.location_id).to eq(location.id)
      expect(customer_item.note_access).to eq('A')
      expect(customer_item.note_before_start).to eq('B')
      expect(customer_item.note_comments).to eq('C')
      expect(customer_item.note_location).to eq('D')
      expect(customer_item.note_schedule).to eq('E')
      expect(customer_item.prepared).to be_truthy
    end
  end
end
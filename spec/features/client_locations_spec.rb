require 'rails_helper'

RSpec.feature 'Features - Client locations', :js do
  given(:location1) {'RUE DES LOUTRES DE MER'}
  given(:location2) {'RUE DES LOUTRES DE RIVIÈRE'}
  given(:city1) {'QUEBEC'}
  given(:city2) {'LEVIS'}
  given(:customer) {create(:customer)}
  given(:door_no1) {'2440'}
  given(:door_no2) {'9917'}
  given(:name1) {'A1'}
  given(:name2) {'A2'}
  given(:postal_code1) {'G1B 2G8'}
  given(:postal_code2) {'G2Z 4P1'}
  given(:province1) {'QC'}
  given(:province2) {'ON'}
  given(:user) {create(:user)}

  background {
    login_as(user)
  }

  scenario 'The page title is visible' do
    visit(customer_path(customer.id))

    expect(page).to have_content('Clients')
  end

  scenario 'The locations list is visible' do
    ## locations creation
    create_location(customer.id, location1, city1, door_no1, name1, postal_code1, province1)
    create_location(customer.id, location2, city2, door_no2, name2, postal_code2, province2)

    visit(customer_path(customer.id))

    ## the first location should be visible
    expect_page_to_have_location(location1, city1, door_no1, postal_code1)

    ## the second location should be visible
    expect_page_to_have_location(location2, city2, door_no2, postal_code2)
  end

  scenario 'The locations list is filterable' do
    ## locations creation
    create_location(customer.id, location1, city1, door_no1, name1, postal_code1, province1)
    create_location(customer.id, location2, city2, door_no2, name2, postal_code2, province2)

    visit(customer_path(customer.id))

    ## the first location should be visible
    expect_page_to_have_location(location1, city1, door_no1, postal_code1)

    ## the second location should be visible
    expect_page_to_have_location(location2, city2, door_no2, postal_code2)

    fill_in(:'cpbr-filtre', with: location1)

    ## the first item should still be visible
    expect_page_to_have_location(location1, city1, door_no1, postal_code1)

    ## the second item should not be visible anymore
    expect_page_not_to_have_location(location2, city2, door_no2, postal_code2)
  end

  scenario 'The locations list is sortable' do
    ## locations creation
    create_location(customer.id, location1, city1, door_no1, name1, postal_code1, province1)
    create_location(customer.id, location2, city2, door_no2, name2, postal_code2, province2)

    visit(customer_path(customer.id))

    first_row = 'tbody tr:nth-child(1)'

    ## the first row should be the first item
    within(first_row) {
      expect_page_to_have_location(location1, city1, door_no1, postal_code1)
    }

    ## sorting the "Numéro Civique" column to be in descending order
    element = page.first('span', text: 'Nom')
    element.click
    element.click

    ## the first row should now be the second item
    within(first_row) {
      expect_page_to_have_location(location2, city2, door_no2, postal_code2)
    }
  end

  context 'pagination' do
    scenario 'the number of row per page can be modified' do
      adr_1s = %w(A1 B2 C3 D4 E5 F6)

      ## adressses creation
      adr_1s.each do |adr_1|
        create_location(customer.id, adr_1, city1, door_no1, name1, postal_code1, province1)
      end

      visit(customer_path(customer.id))

      ## all locations should be on the first page
      adr_1s.each do |adr_1|
        expect_page_to_have_location(adr_1, city1, door_no1, postal_code1)
      end

      ## click on the rows per page select
      within('#cpbr-pagination') do
        page.find('div[role=button]', text: '10', exact_text: true).click
      end

      ## select 5 rows per page
      page.find('li[role=option]', text: '5', exact_text: true).click

      ## the 6th location should not be visible anymore
      expect(page).not_to have_content('F6')
    end

    scenario 'page can be changed' do
      adr_1s = %w(A1 B2 C3 D4 E5 F6 G7 H8 I9 J10)
      last_adr_1 = 'K11'

      ## locations creation
      adr_1s.each do |adr_1|
        create_location(customer.id, adr_1, city1, door_no1, name1, postal_code1, province1)
      end

      create_location(customer.id, last_adr_1, city2, door_no2, name2, postal_code2, province2)

      visit(customer_path(customer.id))

      ## all locations except the last one should be on the first page
      adr_1s.each do |adr_1|
        expect_page_to_have_location(adr_1, city1, door_no1, postal_code1)
      end

      ## the last location should not be on the first page
      expect_page_not_to_have_location(last_adr_1, city2, door_no2, postal_code2)

      ## click on the page change icon
      within('#cpbr-pagination') do
        page.find('[type="button"][tabindex="0"]').click
      end

      ## all locations except the last one should not be on the new page
      adr_1s.each do |adr_1|
        expect_page_not_to_have_location(adr_1, city1, door_no1, postal_code1)
      end

      ## the last location should be on the new page
      expect_page_to_have_location(last_adr_1, city2, door_no2, postal_code2)
    end
  end

  context 'locations can be added' do
    scenario 'fields are validated' do
      visit(customer_path(customer.id))

      find('#cpbr-add-row').click
      click_button('Ajouter')

      expect(page).to have_css('p', text: 'Ne peut être vide', count: 6)
    end

    scenario 'the location is added to the list' do
      visit(customer_path(customer.id))

      expect_page_not_to_have_location(location1, city1, door_no1, postal_code1)

      find('#cpbr-add-row').click

      fill_in('cpbr-name', with: 'Alex')
      fill_in('cpbr-postal-code', with: postal_code1)
      fill_in('cpbr-door-no', with: door_no1)
      fill_in('cpbr-adr1', with: location1)
      fill_in('cpbr-city', with: city1)
      page.find('#cpbr-province', visible: false).find(:xpath, '..').click
      page.find('li[data-value="QC"]', exact_text: true).click

      sleep(1)

      click_button('Ajouter')

      expect_page_to_have_location(location1, city1, door_no1, postal_code1)
    end
  end

  context 'locations can be edited' do
    xscenario 'fields are validated' do
      create_location(customer.id, location1, city1, door_no1, name1, postal_code1, province1)
      
      visit(customer_path(customer.id))

      expect_page_to_have_location(location1, city1, door_no1, postal_code1)

      click_button('cpbr-edit-location')

      find('#cpbr-postal-code').native.clear

      click_button('Éditer')
      
      expect(page).to have_css('p', text: 'Ne peut être vide', count: 5)
    end

    xscenario 'the edited location appears in the list' do
      create_location(customer.id, location1, city1, door_no1, name1, postal_code1, province1)

      visit(customer_path(customer.id))

      expect_page_to_have_location(location1, city1, door_no1, postal_code1)

      click_button('cpbr-edit-location')

      fill_in('cpbr-postal-code', with: postal_code2)
      fill_in('cpbr-door-no', with: door_no2)

      expect_page_to_have_location(location1, city1, door_no2, postal_code2)
    end
  end

  scenario 'locations can be deleted' do
    create_location(customer.id, location1, city1, door_no1, name1, postal_code1, province1)

    visit(customer_path(customer.id))

    expect_page_to_have_location(location1, city1, door_no1, postal_code1)

    click_button('cpbr-delete-location')
    click_button('Continuer')

    expect_page_not_to_have_location(location1, city1, door_no1, postal_code1)
  end
end                                     
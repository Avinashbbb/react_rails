require 'rails_helper'

RSpec.feature 'Features - Customers', :js do
  given(:name1) {'VILLE DE LÉVIS'}
  given(:name2) {'VILLE DE QUEBEC'}
  given(:user) {create(:user)}

  background {
    login_as(user)
  }

  scenario 'The page title is visible' do
    visit(customers_path)

    expect(page).to have_content('Clients')
  end

  scenario 'The customers list is visible' do
    ## customers creation
    create_customer(name1)
    create_customer(name2)

    visit(customers_path)

    ## the first customer should be visible
    expect_page_to_have_customer(name1)

    ## the second customer should be visible
    expect_page_to_have_customer(name2)
  end

  scenario 'The customers list is filterable' do
    ## customers creation
    create_customer(name1)
    create_customer(name2)
    
    visit(customers_path)

    ## the first customer should be visible
    expect_page_to_have_customer(name1)

    ## the second customer should be visible
    expect_page_to_have_customer(name2)

    fill_in(:'cpbr-filtre', with: name1)

    ## the first customer should still be visible
    expect_page_to_have_customer(name1)

    ## the second customer should not be visible anymore
    expect_page_not_to_have_customer(name2)
  end

  scenario 'The customers list is sortable' do
    ## customers creation
    create_customer(name1)
    create_customer(name2)

    visit(customers_path)

    first_row = 'tbody tr:nth-child(1)'

    ## the first row should be the first customer
    within(first_row) {
      expect_page_to_have_customer(name1)
    }

    ## sorting the Nom column to be in descending order
    element = page.first('span', text: 'Nom')
    element.click
    element.click

    ## the first row should now be the second customer
    within(first_row) {
      expect_page_to_have_customer(name2)
    }
  end

  context 'pagination' do
    scenario 'the number of row per page can be modified' do
      names = %w(A1 B2 C3 D4 E5 F6)

      ## customers creation
      names.each do |name|
        create_customer(name)
      end

      visit(customers_path)

      ## all customers should be on the first page
      names.each do |name|
        expect_page_to_have_customer(name)
      end

      ## click on the rows per page select
      within('#cpbr-pagination') do
        page.find('div[role=button]', text: '10', exact_text: true).click
      end

      ## select 5 rows per page
      page.find('li[role=option]', text: '5', exact_text: true).click

      ## the 6th customer should not be visible anymore
      expect(page).not_to have_content('F6')
    end

    scenario 'page can be changed' do
      names = %w(A1 B2 C3 D4 E5 F6 G7 H8 I9 J10)
      last_name = 'K11'
      
      ## customers creation
      names.each do |name|
        create_customer(name)
      end

      create_customer(last_name)

      visit(customers_path)
      
      ## all customers except the last one should be on the first page
      names.each do |name|
        expect_page_to_have_customer(name)
      end

      ## the last customer should not be on the first page
      expect_page_not_to_have_customer(last_name)

      ## click on the page change icon
      within('#cpbr-pagination') do
        page.find('[type="button"][tabindex="0"]').click
      end

      ## all customers except the last one should not be on the new page
      names.each do |name|
        expect_page_not_to_have_customer(name)
      end

      ## the last customer should be on the new page
      expect_page_to_have_customer(last_name)
    end
  end
end
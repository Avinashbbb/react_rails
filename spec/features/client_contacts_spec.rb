require 'rails_helper'

RSpec.feature 'Features - Client contacts', :js do
  given(:customer) {create(:customer)}
  given(:email1) {'alex@zicat.com'}
  given(:email2) {'dom@michaud.com'}
  given(:first_name1) {'ALEX'}
  given(:first_name2) {'DOMINIC'}
  given(:home_phone1) {'4181111111'}
  given(:home_phone2) {'4181111112'}
  given(:last_name1) {'ZICAT'}
  given(:last_name2) {'MICHAUD'}
  given(:work_phone1) {'4189999991'}
  given(:work_phone2) {'4189999992'}
  given(:user) {create(:user)}

  background {
    login_as(user)
  }

  scenario 'The page title is visible' do
    visit(customer_path(customer.id))
    click_contact_tab

    expect(page).to have_content('Clients')
  end

  scenario 'The contacts list is visible' do
    ## contacts creation
    create_contact(customer.id, email1, first_name1, home_phone1, last_name1, work_phone1)
    create_contact(customer.id, email2, first_name2, home_phone2, last_name2, work_phone2)

    visit(customer_path(customer.id))
    click_contact_tab

    ## the first contact should be visible
    expect_page_to_have_contact(email1, first_name1, home_phone1, last_name1)

    ## the second contact should be visible
    expect_page_to_have_contact(email2, first_name2, home_phone2, last_name2)
  end

  scenario 'The contacts list is filterable' do
    ## contacts creation
    create_contact(customer.id, email1, first_name1, home_phone1, last_name1, work_phone1)
    create_contact(customer.id, email2, first_name2, home_phone2, last_name2, work_phone2)

    visit(customer_path(customer.id))
    click_contact_tab

    ## the first contact should be visible
    expect_page_to_have_contact(email1, first_name1, home_phone1, last_name1)

    ## the second contact should be visible
    expect_page_to_have_contact(email2, first_name2, home_phone2, last_name2)

    fill_in(:'cpbr-filtre', with: email1)

    ## the first contact should still be visible
    expect_page_to_have_contact(email1, first_name1, home_phone1, last_name1)

    ## the second contact should not be visible anymore
    expect_page_not_to_have_contact(email2, first_name2, home_phone2, last_name2)
  end

  scenario 'The contacts list is sortable' do
    ## contacts creation
    create_contact(customer.id, email1, first_name1, home_phone1, last_name1, work_phone1)
    create_contact(customer.id, email2, first_name2, home_phone2, last_name2, work_phone2)

    visit(customer_path(customer.id))
    click_contact_tab

    first_row = 'tbody tr:nth-child(1)'

    ## the first row should be the first contact
    within(first_row) {
      expect_page_to_have_contact(email1, first_name1, home_phone1, last_name1)
    }

    ## sorting the "Courriel" column to be in descending order
    element = page.first('span', text: 'Courriel')
    element.click
    element.click

    ## the first row should now be the second contact
    within(first_row) {
      expect_page_to_have_contact(email2, first_name2, home_phone2, last_name2)
    }
  end

  context 'pagination' do
    scenario 'the number of row per page can be modified' do
      first_names = %w(A1 B2 C3 D4 E5 F6 G7 H8 I9 J10)
      last_first_name = 'K11'

      ## adressses creation
      first_names.each do |first_name|
        create_contact(customer.id, email1, first_name, home_phone1, last_name1, work_phone1)
      end

      create_contact(customer.id, email1, last_first_name, home_phone1, last_name1, work_phone1)

      visit(customer_path(customer.id))
      click_contact_tab

      ## all contacts should be on the first page
      first_names.each do |first_name|
        expect_page_to_have_contact(email1, first_name, home_phone1, last_name1)
      end

      expect(page).not_to have_content(last_first_name)

      ## click on the rows per page select
      within('#cpbr-pagination') do
        page.find('div[role=button]', text: '10', exact_text: true).click
      end

      ## select 5 rows per page
      page.find('li[role=option]', text: '25', exact_text: true).click

      ## the 6th contact should not be visible anymore
      expect(page).to have_content(last_first_name)
    end

    scenario 'page can be changed' do
      first_names = %w(A1 B2 C3 D4 E5 F6 G7 H8 I9 J10)
      last_first_name = 'K11'

      ## contacts creation
      first_names.each do |first_name|
        create_contact(customer.id, email1, first_name, home_phone1, last_name1, work_phone1)
      end

      create_contact(customer.id, email1, last_first_name, home_phone1, last_name1, work_phone1)

      visit(customer_path(customer.id))
      click_contact_tab

      ## all contacts except the last one should be on the first page
      first_names.each do |first_name|
        expect(page).to have_content(first_name)
      end

      ## the last contact should not be on the first page
      expect(page).not_to have_content(last_first_name)

      ## click on the page change icon
      within('#cpbr-pagination') do
        page.find('[type="button"][tabindex="0"]').click
      end

      ## all contacts except the last one should not be on the new page
      first_names.each do |first_name|
        expect(page).not_to have_content(first_name)
      end

      ## the last contact should be on the new page
      expect(page).to have_content(last_first_name)
    end
  end

  context 'contacts can be added' do
    scenario 'fields are validated' do
      visit(customer_path(customer.id))
      click_contact_tab

      find('#cpbr-add-row').click
      click_button('Ajouter')

      expect(page).to have_css('p', text: 'Ne peut être vide', count: 4)
    end

    scenario 'the contacts is added to the list' do
      visit(customer_path(customer.id))
      click_contact_tab

      expect_page_not_to_have_contact(email1, first_name1, home_phone1, last_name1)

      find('#cpbr-add-row').click

      fill_in('cpbr-email', with: email1)
      fill_in('cpbr-first-name', with: first_name1)
      fill_in('cpbr-last-name', with: last_name1)
      fill_in('cpbr-home-phone', with: home_phone1)

      click_button('Ajouter')

      expect_page_to_have_contact(email1, first_name1, home_phone1, last_name1)
    end
  end

  context 'contacts can be edited' do
    xscenario 'fields are validated' do
    end

    xscenario 'the edited contact appears in the list' do
    end
  end

  scenario 'contacts can be deleted' do
    create_contact(customer.id, email1, first_name1, home_phone1, last_name1, work_phone1)

    visit(customer_path(customer.id))
    click_contact_tab

    expect_page_to_have_contact(email1, first_name1, home_phone1, last_name1)

    click_button('cpbr-delete-contact')
    click_button('Continuer')

    expect_page_not_to_have_contact(email1, first_name1, home_phone1, last_name1)
  end
end                                     
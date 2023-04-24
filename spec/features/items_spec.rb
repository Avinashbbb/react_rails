require 'rails_helper'

RSpec.feature 'Features - Items', :js do
  given(:kind1) {'Container'}
  given(:kind2) {'Truck'}
  given(:spec1) {'10 verges'}
  given(:spec2) {'4 roues'}
  given(:user) {create(:user)}

  background {
    login_as(user)
  }

  scenario 'The page title is visible' do
    visit(items_path)

    expect(page).to have_content('Inventaire')
  end

  scenario 'The items list is visible' do
    ## items creation
    create_item('1111', :container, spec1)
    create_item('9999', :truck, spec2)

    visit(items_path)

    ## the first item should be visible
    expect(page).to have_content('1111')
    expect(page).to have_content(kind1)
    expect(page).to have_content(spec1)
    expect(page).to have_content('Disponible')

    ## the second item should be visible
    expect(page).to have_content('9999')
    expect(page).to have_content(kind2)
    expect(page).to have_content(spec2)
    expect(page).to have_content('Disponible')
  end

  scenario 'The items list is filterable' do
    ## items creation
    create_item('1111', :container, spec1)
    create_item('9999', :truck, spec2)

    visit(items_path)

    identifier1 = '1111'
    identifier2 = '9999'

    ## the first item should be visible
    expect_page_to_have_item(identifier1, kind1, spec1)

    ## the second item should be visible
    expect_page_to_have_item(identifier2, kind2, spec2)

    fill_in(:'cpbr-filtre', with: kind1)

    ## the first item should still be visible
    expect_page_to_have_item(identifier1, kind1, spec1)

    ## the second item should not be visible anymore
    expect_page_not_to_have_item(identifier2, kind2, spec2)
  end

  scenario 'The items list is sortable' do
    ## items creation
    create_item('1111', :container, spec1)
    create_item('9999', :truck, spec2)

    visit(items_path)

    first_row = 'tbody tr:nth-child(1)'

    ## the first row should be the first item
    within(first_row) {
      expect_page_to_have_item('1111', kind1, spec1)
    }

    ## sorting the Numéro column to be in descending order
    element = page.first('span', text: 'Numéro')
    element.click
    element.click

    ## the first row should now be the second item
    within(first_row) {
      expect_page_to_have_item('9999', kind2, spec2)
    }
  end

  context 'pagination' do
    scenario 'the number of row per page can be modified' do
      identifiers = %w(a1 b2 c3 d4 e5 f6)

      ## items creation
      identifiers.each do |identifier|
        create_item(identifier, :container, spec1)
      end

      visit(items_path)

      ## all items should be on the first page
      identifiers.each do |identifier|
        expect_page_to_have_item(identifier, kind1, spec1)
      end

      ## click on the rows per page select
      within('#cpbr-pagination') do
        page.find('div[role=button]', text: '10', exact_text: true).click
      end

      ## select 5 rows per page
      page.find('li[role=option]', text: '5', exact_text: true).click

      ## the 6th item should not be visible anymore
      expect(page).not_to have_content('f6')
    end

    scenario 'page can be changed' do
      identifiers = %w(a1 b2 c3 d4 e5 f6 g7 h8 i9 j10)
      last_identifier = 'k11'
      
      ## items creation
      identifiers.each do |identifier|
        create_item(identifier, :container, spec1)
      end

      create_item(last_identifier, :truck, spec2)

      visit(items_path)
      
      ## all items except the last one should be on the first page
      identifiers.each do |identifier|
        expect_page_to_have_item(identifier, kind1, spec1)
      end

      ## the last item should not be on the first page
      expect_page_not_to_have_item(last_identifier, kind2, spec2)

      ## click on the page change icon
      within('#cpbr-pagination') do
        page.find('[type="button"][tabindex="0"]').click
      end

      ## all items except the last one should not be on the new page
      identifiers.each do |identifier|
        expect_page_not_to_have_item(identifier, kind1, spec1)
      end

      ## the last item should be on the new page
      expect_page_to_have_item(last_identifier, kind2, spec2)
    end
  end
end
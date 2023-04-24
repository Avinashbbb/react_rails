module CustomerHelper
  def create_customer(name)
    create(:customer, name: name)
  end

  def expect_page_to_have_customer(name)
    expect(page).to have_content(name)
  end

  def expect_page_not_to_have_customer(name)
    expect(page).not_to have_content(name)
  end
end
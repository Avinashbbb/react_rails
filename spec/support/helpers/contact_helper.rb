module ContactHelper
  def click_contact_tab
    click_button('Contacts')
  end
  
  def create_contact(customer_id, email, first_name, home_phone, last_name, work_phone)
    contact = create(:contact, customer_id: customer_id, email: email, first_name: first_name, last_name: last_name)
    
    create(:phone, :home, contact: contact, phone_no: home_phone)
    create(:phone, :work, contact: contact, phone_no: work_phone)
  end
  
  def expect_page_to_have_contact(email, first_name, home_phone, last_name)
    expect(page).to have_content(first_name)
    expect(page).to have_content(last_name)
    expect(page).to have_content(email)
    expect(page).to have_content(home_phone)
  end

  def expect_page_not_to_have_contact(email, first_name, home_phone, last_name)
    expect(page).not_to have_content(first_name)
    expect(page).not_to have_content(last_name)
    expect(page).not_to have_content(email)
    expect(page).not_to have_content(home_phone)
  end
end
module LocationHelper
  def create_location(customer_id, adresse, city, door_no, name, postal_code, province)
    location = create(:location, locatable_id: customer_id, locatable_type: 'Optigo::Customer', name: name)
    create(:address, addressable_id: location.id, addressable_type: 'Optigo::Location', adr_1: adresse, city: city, door_no: door_no, postal_code: postal_code, province: province)

    location
  end
  
  def expect_page_to_have_location(adr1, city, door_no, postal_code)
    expect(page).to have_content(adr1)
    expect(page).to have_content(city)
    expect(page).to have_content(door_no)
    expect(page).to have_content(postal_code)
  end

  def expect_page_not_to_have_location(adr1, city, door_no, postal_code)
    expect(page).not_to have_content(adr1)
    expect(page).not_to have_content(city)
    expect(page).not_to have_content(door_no)
    expect(page).not_to have_content(postal_code)
  end
end
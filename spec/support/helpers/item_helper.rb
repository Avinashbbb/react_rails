module ItemHelper
  def create_item(identifier, kind, spec)
    item_kind1 = create(:item_kind, kind)
    item_spec1 = create(:item_spec, name: spec, item_kind: item_kind1)

    create(:item, identifier: identifier, item_kind: item_kind1, item_spec: item_spec1)
  end

  def expect_page_to_have_item(identifier, kind, spec)
    expect(page).to have_content(identifier)
    expect(page).to have_content(kind)
    expect(page).to have_content(spec)
    expect(page).to have_content('Disponible')
  end

  def expect_page_not_to_have_item(identifier, kind, spec)
    expect(page).not_to have_content(identifier)
    expect(page).not_to have_content(kind)
    expect(page).not_to have_content(spec)
  end
end
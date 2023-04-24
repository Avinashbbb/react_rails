module DeviseHelper
  def devise_error_messages!
    return '' if resource.errors.empty?

    messages = resource.errors.full_messages.map { |msg| content_tag(:li, msg) }.join

    html = <<-HTML.strip
      <div class="alert alert-danger" id="error_explanation">
        <ul>#{messages}</ul>
      </div>
    HTML

    html.html_safe
  end
end
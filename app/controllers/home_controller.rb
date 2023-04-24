require 'models/normalizer'

class HomeController < ApplicationController
  before_action :authenticate_user!

  def index
    container_kinds = Models::Normalizer.normalize(Optigo::ContainerKind.all) {|container_kind| ContainerKindSerializer.new(container_kind).serializable_hash}
    item_kinds = Models::Normalizer.normalize(Optigo::ItemKind.all) {|item_kind| ItemKindSerializer.new(item_kind).serializable_hash}
    item_specs = Models::Normalizer.normalize(Optigo::ItemSpec.all) {|item_spec| ItemSpecSerializer.new(item_spec).serializable_hash}
    job_templates = Models::Normalizer.normalize(Optigo::JobTemplate.all) {|job_template| JobTemplateSerializer.new(job_template).serializable_hash}
    #units = Models::Normalizer.normalize(Optigo::Unit.all) {|unit| UnitSerializer.new(unit).serializable_hash}

    render(sea_otter: {location: request.fullpath, redux: {
        containerKinds: container_kinds,
        itemKinds: item_kinds,
        itemSpecs: item_specs,
        jobTemplates: job_templates,
        #units: units,
    }})
  end
end
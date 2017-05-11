class StaticPagesController < ApplicationController
  def index
  end

  def record
  end

  def upload
    begin
      uploaded_io = params[:video_blob]
      file_name = params[:filename]
      File.open(Rails.root.join('public', 'uploads', file_name + '.webm'), 'wb') do |file|
        file.write(uploaded_io.read)
      end
      render status: 200, json: { message: 'Successfully uploaded' }
    rescue
      render status: 422, json: { message: 'Unprocessable entity' }
    end
  end
end

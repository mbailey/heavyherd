require 'test_helper'

class TicketSellersControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:ticket_sellers)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create ticket_seller" do
    assert_difference('TicketSeller.count') do
      post :create, :ticket_seller => { }
    end

    assert_redirected_to ticket_seller_path(assigns(:ticket_seller))
  end

  test "should show ticket_seller" do
    get :show, :id => ticket_sellers(:one).id
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => ticket_sellers(:one).id
    assert_response :success
  end

  test "should update ticket_seller" do
    put :update, :id => ticket_sellers(:one).id, :ticket_seller => { }
    assert_redirected_to ticket_seller_path(assigns(:ticket_seller))
  end

  test "should destroy ticket_seller" do
    assert_difference('TicketSeller.count', -1) do
      delete :destroy, :id => ticket_sellers(:one).id
    end

    assert_redirected_to ticket_sellers_path
  end
end

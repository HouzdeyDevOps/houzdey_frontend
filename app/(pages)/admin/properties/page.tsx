"use client";

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, 
  MoreVertical, 
  Edit,
  Trash2,
  Home,
  MapPin,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  DollarSign
} from 'lucide-react';
import { adminApi } from '@/api/admin';
import { AdminProperty, AdminFilters } from '@/@types/admin';
import { toast } from 'sonner';

interface PropertyActionsDropdownProps {
  property: AdminProperty;
  onView: (property: AdminProperty) => void;
  onEdit: (property: AdminProperty) => void;
  onUpdateStatus: (property: AdminProperty, status: string) => void;
  onDelete: (property: AdminProperty) => void;
}

const PropertyActionsDropdown = ({ property, onView, onEdit, onUpdateStatus, onDelete }: PropertyActionsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-gray-100 rounded"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              <button
                onClick={() => {
                  onView(property);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Eye className="w-4 h-4" />
                View Property
              </button>
              
              <button
                onClick={() => {
                  onEdit(property);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit className="w-4 h-4" />
                Edit Property
              </button>
              
              {property.status === 'available' ? (
                <button
                  onClick={() => {
                    onUpdateStatus(property, 'unavailable');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-orange-600 hover:bg-gray-100"
                >
                  <XCircle className="w-4 h-4" />
                  Mark Unavailable
                </button>
              ) : (
                <button
                  onClick={() => {
                    onUpdateStatus(property, 'available');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark Available
                </button>
              )}
              
              <button
                onClick={() => {
                  onDelete(property);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <Trash2 className="w-4 h-4" />
                Delete Property
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default function PropertiesManagement() {
  const [filters, setFilters] = useState<AdminFilters>({
    page: 1,
    limit: 20,
    search: '',
    status: '',
    listing_type: ''
  });
  const queryClient = useQueryClient();

  const { data: properties, isLoading } = useQuery<AdminProperty[]>({
    queryKey: ['admin-properties', filters],
    queryFn: () => adminApi.getProperties(filters),
    keepPreviousData: true,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ propertyId, status }: { propertyId: string; status: string }) =>
      adminApi.updatePropertyStatus(propertyId, status),
    onSuccess: () => {
      toast.success('Property status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
    },
    onError: () => {
      toast.error('Failed to update property status');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (propertyId: string) => adminApi.deleteProperty(propertyId),
    onSuccess: () => {
      toast.success('Property deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
    },
    onError: () => {
      toast.error('Failed to delete property');
    },
  });

  const handleView = (property: AdminProperty) => {
    window.open(`/properties/${property.id}`, '_blank');
  };

  const handleEdit = (property: AdminProperty) => {
    // TODO: Implement edit functionality
    console.log('Edit property:', property);
  };

  const handleUpdateStatus = (property: AdminProperty, status: string) => {
    updateStatusMutation.mutate({ propertyId: property.id, status });
  };

  const handleDelete = (property: AdminProperty) => {
    if (confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      deleteMutation.mutate(property.id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      available: 'bg-green-100 text-green-800',
      unavailable: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      draft: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getListingTypeBadge = (listingType: string) => {
    const typeStyles = {
      rent: 'bg-blue-100 text-blue-800',
      sale: 'bg-green-100 text-green-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeStyles[listingType as keyof typeof typeStyles] || 'bg-gray-100 text-gray-800'}`}>
        For {listingType}
      </span>
    );
  };

  const formatPrice = (property: AdminProperty) => {
    const price = property.listing_type === 'rent' 
      ? (property.rental_price || property.price)
      : (property.sale_price || property.price);
    
    return property.listing_type === 'rent' 
      ? `₦${price.toLocaleString()}/month`
      : `₦${price.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Properties Management</h1>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-16 h-12 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties Management</h1>
          <p className="text-gray-600">Manage property listings and status</p>
        </div>
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-600">
            {properties?.length || 0} properties
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties by title or location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
            />
          </div>

          {/* Status Filter */}
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
          >
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
            <option value="pending">Pending</option>
            <option value="draft">Draft</option>
          </select>

          {/* Listing Type Filter */}
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={filters.listing_type}
            onChange={(e) => setFilters(prev => ({ ...prev, listing_type: e.target.value, page: 1 }))}
          >
            <option value="">All Types</option>
            <option value="rent">For Rent</option>
            <option value="sale">For Sale</option>
          </select>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Listed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {properties?.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-12 w-16 rounded object-cover"
                        src={property.images[0] || '/assets/images/placeholder-property.jpg'}
                        alt={property.title}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {property.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {property.type}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <div>{property.lga}, {property.state}</div>
                        <div className="text-xs text-gray-500">{property.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      {formatPrice(property)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getListingTypeBadge(property.listing_type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(property.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{property.owner.name}</div>
                      <div className="text-xs text-gray-500">{property.owner.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(property.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <PropertyActionsDropdown
                      property={property}
                      onView={handleView}
                      onEdit={handleEdit}
                      onUpdateStatus={handleUpdateStatus}
                      onDelete={handleDelete}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!properties || properties.length === 0) && (
          <div className="text-center py-12">
            <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No properties found</p>
          </div>
        )}
      </div>
    </div>
  );
} 
import { useState, useEffect } from 'react';
import { Text } from '../../components/ui/Text';
import { useMasterDataActions, type PhysicalLocation } from '../../store/masterDataStore';
import { PhysicalLocationTable } from '../../components/features/master/PhysicalLocationTable';
import { SpecifiedLocationTable } from '../../components/features/master/SpecifiedLocationTable';

export default function MasterAreaPage() {
    const [view, setView] = useState<'physical' | 'specified'>('physical');
    const [selectedLocation, setSelectedLocation] = useState<PhysicalLocation | null>(null);
    const { fetchPhysicalLocations, fetchSpecifiedLocations } = useMasterDataActions();

    useEffect(() => {
        if (view === 'physical') {
            fetchPhysicalLocations();
        } else if (view === 'specified' && selectedLocation) {
            fetchSpecifiedLocations(selectedLocation.id);
        }
    }, [view, selectedLocation, fetchPhysicalLocations, fetchSpecifiedLocations]);

    const handleViewSpecified = (location: PhysicalLocation) => {
        setSelectedLocation(location);
        setView('specified');
    };

    const handleBackToPhysical = () => {
        setSelectedLocation(null);
        setView('physical');
    };

    if (view === 'specified' && !selectedLocation) {
        handleBackToPhysical();
        return null;
    }

    return (
        <div className="space-y-6">
            {view === 'physical' ? (
                <>
                    <Text as="h1" variant="display">Master Area Pabrik</Text>
                    <PhysicalLocationTable onViewSpecified={handleViewSpecified} />
                </>
            ) : (
                <>
                    <Text as="h1" variant="display">
                        Sub Area Pabrik: {selectedLocation?.name}
                    </Text>
                    <SpecifiedLocationTable
                        physicalLocation={selectedLocation!}
                        onBack={handleBackToPhysical}
                    />
                </>
            )}
        </div>
    );
}
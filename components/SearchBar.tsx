"use client";

import {
  ActionIcon,
  Box,
  Combobox,
  Group,
  Loader,
  Text,
  TextInput,
  Tooltip,
  useCombobox
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  FaLocationCrosshairs,
  FaLocationDot,
  FaMagnifyingGlass,
  FaXmark
} from "react-icons/fa6";
import { useState } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { setActiveLocation } from "@/lib/features/weather/weatherSlice";
import {
  useLazyReverseGeocodeQuery,
  useSearchCitiesQuery
} from "@/lib/features/weather/weatherApi";
import type { GeoLocation } from "@/types/weather";

export default function SearchBar() {
  const dispatch = useAppDispatch();
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption()
  });
  const [value, setValue] = useState("");
  const [debounced] = useDebouncedValue(value, 350);
  const shouldSearch = debounced.trim().length >= 2;

  const { data, isFetching } = useSearchCitiesQuery(debounced.trim(), {
    skip: !shouldSearch
  });

  const [reverseGeocode, { isFetching: isLocating }] = useLazyReverseGeocodeQuery();
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      notifications.show({
        color: "red",
        title: "Geolocation unavailable",
        message: "Your browser does not support geolocation."
      });
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const result = await reverseGeocode({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          }).unwrap();
          const first = result?.[0];
          if (!first) {
            notifications.show({
              color: "yellow",
              title: "Location found, but no city match",
              message: "Using raw coordinates."
            });
            dispatch(
              setActiveLocation({
                name: "Current location",
                country: "",
                lat: pos.coords.latitude,
                lon: pos.coords.longitude
              })
            );
          } else {
            dispatch(
              setActiveLocation({
                name: first.name,
                country: first.country,
                state: first.state,
                lat: first.lat,
                lon: first.lon
              })
            );
          }
        } catch {
          notifications.show({
            color: "red",
            title: "Reverse geocoding failed",
            message: "Please try again."
          });
        } finally {
          setGettingLocation(false);
        }
      },
      () => {
        setGettingLocation(false);
        notifications.show({
          color: "red",
          title: "Location denied",
          message: "Please allow location access or search manually."
        });
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  };

  const selectOption = (option: GeoLocation) => {
    dispatch(
      setActiveLocation({
        name: option.name,
        country: option.country,
        state: option.state,
        lat: option.lat,
        lon: option.lon
      })
    );
    setValue(`${option.name}${option.state ? ", " + option.state : ""}, ${option.country}`);
    combobox.closeDropdown();
  };

  return (
    <Combobox
      store={combobox}
      withinPortal
      onOptionSubmit={(val) => {
        const option = data?.find(
          (o) => `${o.lat},${o.lon}` === val
        );
        if (!option) return;
        selectOption(option);
      }}
    >
      <Combobox.Target>
        <TextInput
          size="lg"
          radius="xl"
          placeholder="Search for a city, region, or country..."
          value={value}
          onChange={(e) => {
            setValue(e.currentTarget.value);
            combobox.openDropdown();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const first = data?.[0];
              if (first) {
                selectOption(first);
              } else {
                combobox.closeDropdown();
              }
            }
          }}
          onFocus={() => shouldSearch && combobox.openDropdown()}
          onBlur={() => combobox.closeDropdown()}
          leftSection={<FaMagnifyingGlass size={18} />}
          rightSection={
            <Group gap={4} wrap="nowrap" pr={6}>
              {(isFetching || isLocating || gettingLocation) && <Loader size="xs" />}
              {value && !isFetching && (
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="gray"
                  aria-label="Clear"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setValue("");
                  }}
                >
                  <FaXmark size={14} />
                </ActionIcon>
              )}
              <Tooltip label="Use my location" withArrow>
                <ActionIcon
                  size="md"
                  radius="xl"
                  variant="light"
                  color="cyan"
                  aria-label="Use my location"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleLocate}
                  loading={gettingLocation || isLocating}
                >
                  <FaLocationCrosshairs size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
          }
          rightSectionWidth={108}
          styles={{
            input: {
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(14px)",
              color: "white"
            }
          }}
        />
      </Combobox.Target>

      <Combobox.Dropdown
        style={{
          background: "rgba(20,25,40,0.85)",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        <Combobox.Options>
          {!shouldSearch && (
            <Combobox.Empty>Type at least 2 characters to search.</Combobox.Empty>
          )}
          {shouldSearch && !isFetching && (data?.length ?? 0) === 0 && (
            <Combobox.Empty>No matches. Try a different name.</Combobox.Empty>
          )}
          {data?.map((opt) => (
            <Combobox.Option
              key={`${opt.lat},${opt.lon}`}
              value={`${opt.lat},${opt.lon}`}
            >
              <Group gap="sm" wrap="nowrap">
                <Box
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.08)",
                    display: "grid",
                    placeItems: "center"
                  }}
                >
                  <FaLocationDot size={15} />
                </Box>
                <Box>
                  <Text size="sm" fw={600} c="white">
                    {opt.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {[opt.state, opt.country].filter(Boolean).join(", ")}
                  </Text>
                </Box>
              </Group>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

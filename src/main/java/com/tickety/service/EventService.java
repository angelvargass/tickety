package com.tickety.service;

import com.tickety.domain.Event;
import com.tickety.domain.Ticket;
import com.tickety.repository.EventRepository;
import com.tickety.repository.TicketRepository;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final TicketRepository ticketRepository;

    public EventService(EventRepository eventRepository, TicketRepository ticketRepository) {
        this.eventRepository = eventRepository;
        this.ticketRepository = ticketRepository;
    }

    public Map<String, Long> getTopSellerEvents() {
        List<Ticket> allTickets = this.ticketRepository.findAll();
        Map<Long, Long> amountPerEvent = new HashMap<>();

        for (Ticket ticket : allTickets) {
            Long eventId = ticket.getEvent().getId();
            Long actualAmount = amountPerEvent.getOrDefault(eventId, 0L);
            amountPerEvent.put(eventId, actualAmount + ticket.getAmount());
        }

        Map<Long, Long> top3AmountPerEvent = amountPerEvent
            .entrySet()
            .stream()
            .sorted(Collections.reverseOrder(Map.Entry.comparingByValue()))
            .limit(3)
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (a, b) -> a, LinkedHashMap::new));

        Map<String, Long> topEventNamesAndAmounts = new LinkedHashMap<>();
        for (Map.Entry<Long, Long> entry : top3AmountPerEvent.entrySet()) {
            Long eventId = entry.getKey();
            Long eventAmount = entry.getValue();
            Event event = this.eventRepository.findById(eventId).get();
            topEventNamesAndAmounts.put(event.getEventName(), eventAmount);
        }
        return topEventNamesAndAmounts;
    }
}
